// admin/project-form.js — Create / Edit project (CKEditor)

import { initAdminLayout } from './layout.js';
import { api, uploadImage } from '../api.js';

const params    = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const isEdit    = !!projectId;

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function techStackToString(tech) {
  if (!tech) return '';
  if (Array.isArray(tech)) return tech.join(', ');
  return tech;
}

function buildForm(project = {}) {
  const imgVal  = project.featured_image || '';
  const techStr = techStackToString(project.tech_stack);
  return `
    <form id="project-form" novalidate>
      <div class="row g-4">

        <!-- Left: main content -->
        <div class="col-lg-8">
          <div class="admin-form-card mb-3">
            <div class="mb-3">
              <label class="form-label fw-medium">Title <span class="text-danger">*</span></label>
              <input type="text" id="f-title" class="form-control" value="${project.title || ''}" required />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Slug</label>
              <input type="text" id="f-slug" class="form-control" value="${project.slug || ''}" />
              <div class="form-text">Auto-generated from title.</div>
            </div>
            <div>
              <label class="form-label fw-medium">Excerpt / Short Description</label>
              <textarea id="f-excerpt" class="form-control" rows="3">${project.excerpt || ''}</textarea>
            </div>
          </div>

          <div class="admin-form-card">
            <label class="form-label fw-medium mb-2">Content <span class="text-danger">*</span></label>
            <textarea id="f-content">${project.content || ''}</textarea>
          </div>
        </div>

        <!-- Right: sidebar options -->
        <div class="col-lg-4">

          <!-- Publish -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Publish</h6>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="f-published" ${project.is_published ? 'checked' : ''} />
              <label class="form-check-label" for="f-published">Published</label>
            </div>
            <button type="submit" class="btn btn-orange rounded-pill w-100 fw-semibold">
              <i class="bi bi-save me-1"></i> ${isEdit ? 'Update Project' : 'Create Project'}
            </button>
            ${isEdit ? `<a href="projects.html" class="btn btn-outline-secondary rounded-pill w-100 mt-2">Cancel</a>` : ''}
          </div>

          <!-- Details -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Details</h6>
            <div class="mb-3">
              <label class="form-label fw-medium">Category</label>
              <input type="text" id="f-category" class="form-control" value="${project.category || ''}" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Tech Stack</label>
              <input type="text" id="f-tech" class="form-control" value="${techStr}"
                     placeholder="React, Laravel, MySQL" />
              <div class="form-text">Comma-separated list of technologies.</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Live URL</label>
              <input type="url" id="f-live" class="form-control" value="${project.live_url || ''}" placeholder="https://..." />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">GitHub URL</label>
              <input type="url" id="f-github" class="form-control" value="${project.github_url || ''}" placeholder="https://github.com/..." />
            </div>
            <div>
              <label class="form-label fw-medium">Display Order</label>
              <input type="number" id="f-order" class="form-control" value="${project.order ?? 0}" min="0" />
            </div>
          </div>

          <!-- Featured Image -->
          <div class="admin-form-card">
            <h6 class="fw-semibold mb-3">Featured Image</h6>
            <div class="mb-2">
              <label class="form-label small text-secondary">Image URL</label>
              <input type="text" id="f-image" class="form-control" placeholder="https://..." value="${imgVal}" />
            </div>
            <div class="mb-2">
              <label class="form-label small text-secondary">Or upload a file</label>
              <input type="file" id="f-image-upload" class="form-control form-control-sm" accept="image/*" />
            </div>
            <img id="img-preview" src="${imgVal}" class="img-fluid rounded mt-2 ${imgVal ? '' : 'd-none'}" alt="preview" />
          </div>

        </div>
      </div>

      <div id="form-alert" class="alert d-none mt-3"></div>
    </form>
  `;
}

function showAlert(msg, type = 'danger') {
  const el = document.getElementById('form-alert');
  el.textContent = msg;
  el.className = `alert alert-${type} mt-3`;
}

// CKEditor custom upload adapter
function CKUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
    upload: () => loader.file.then(file =>
      uploadImage(file).then(r => ({ default: r.url }))
    ),
    abort: () => {},
  });
}

async function render() {
  if (!initAdminLayout(isEdit ? 'Edit Project' : 'New Project', 'projects')) return;

  const main = document.getElementById('admin-main');

  let project = {};
  if (isEdit) {
    try {
      const projects = await api.adminGetProjects();
      project = projects.find(p => String(p.id) === projectId) || {};
    } catch (e) {
      main.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
      return;
    }
  }

  main.innerHTML = buildForm(project);

  // Auto-slug from title
  const titleEl = document.getElementById('f-title');
  const slugEl  = document.getElementById('f-slug');
  titleEl.addEventListener('input', () => {
    if (!isEdit || !slugEl._manuallyEdited) {
      slugEl.value = slugify(titleEl.value);
    }
  });
  slugEl.addEventListener('input', () => { slugEl._manuallyEdited = true; });

  // Featured image upload
  document.getElementById('f-image-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      document.getElementById('f-image').value = url;
      const preview = document.getElementById('img-preview');
      preview.src = url;
      preview.classList.remove('d-none');
    } catch (err) {
      showAlert('Image upload failed: ' + err.message);
    }
  });

  // Image URL live preview
  document.getElementById('f-image').addEventListener('input', (e) => {
    const preview = document.getElementById('img-preview');
    if (e.target.value) {
      preview.src = e.target.value;
      preview.classList.remove('d-none');
    } else {
      preview.classList.add('d-none');
    }
  });

  // Init CKEditor
  let ckEditor = null;
  ClassicEditor
    .create(document.getElementById('f-content'), {
      extraPlugins: [CKUploadAdapterPlugin],
      toolbar: {
        items: [
          'heading', '|',
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'link', 'bulletedList', 'numberedList', '|',
          'outdent', 'indent', '|',
          'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', '|',
          'undo', 'redo',
        ],
      },
    })
    .then(editor => { ckEditor = editor; })
    .catch(err => console.error(err));

  // Form submit
  document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true;

    const techRaw = document.getElementById('f-tech').value;
    const techStack = techRaw
      ? techRaw.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title:          document.getElementById('f-title').value.trim(),
      slug:           slugEl.value.trim() || slugify(titleEl.value),
      category:       document.getElementById('f-category').value.trim(),
      excerpt:        document.getElementById('f-excerpt').value.trim(),
      featured_image: document.getElementById('f-image').value.trim(),
      content:        ckEditor ? ckEditor.getData() : '',
      tech_stack:     techStack,
      live_url:       document.getElementById('f-live').value.trim(),
      github_url:     document.getElementById('f-github').value.trim(),
      order:          parseInt(document.getElementById('f-order').value, 10) || 0,
      is_published:   document.getElementById('f-published').checked,
    };

    try {
      if (isEdit) {
        await api.updateProject(projectId, payload);
        showAlert('Project updated successfully!', 'success');
      } else {
        await api.createProject(payload);
        showAlert('Project created! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'projects.html', 1500);
      }
    } catch (err) {
      showAlert(err.message);
    } finally {
      btn.disabled = false;
    }
  });
}

render();
