// admin/project-form.js — Create / Edit project (CKEditor)

import { initAdminLayout } from './layout.js';
import { api, uploadImage } from '../api.js';
import { showToast } from '../toast.js';

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
              <input type="text" id="f-title" class="form-control" value="${project.title || ''}"
                     placeholder="Enter project title" />
              <div class="invalid-feedback" id="err-title"></div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Slug</label>
              <input type="text" id="f-slug" class="form-control" value="${project.slug || ''}"
                     placeholder="auto-generated-from-title" />
              <div class="form-text">Auto-generated from title. Lowercase letters, numbers and hyphens only.</div>
              <div class="invalid-feedback" id="err-slug"></div>
            </div>
            <div>
              <label class="form-label fw-medium">Excerpt / Short Description</label>
              <textarea id="f-excerpt" class="form-control" rows="3"
                        placeholder="Short description shown in project card…">${project.excerpt || ''}</textarea>
              <div class="form-text">Optional. Max 500 characters.</div>
              <div class="invalid-feedback" id="err-excerpt"></div>
            </div>
          </div>

          <div class="admin-form-card">
            <label class="form-label fw-medium mb-2">Content <span class="text-danger">*</span></label>
            <textarea id="f-content"></textarea>
            <div class="text-danger small mt-2 d-none" id="err-content">
              <i class="bi bi-exclamation-circle me-1"></i><span id="err-content-text"></span>
            </div>
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
            <button type="submit" class="btn btn-orange rounded-pill w-100 fw-semibold" id="submit-btn">
              <i class="bi bi-save me-1"></i> ${isEdit ? 'Update Project' : 'Create Project'}
            </button>
            ${isEdit ? `<a href="projects.html" class="btn btn-outline-secondary rounded-pill w-100 mt-2">Cancel</a>` : ''}
          </div>

          <!-- Details -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Details</h6>
            <div class="mb-3">
              <label class="form-label fw-medium">Category</label>
              <input type="text" id="f-category" class="form-control" value="${project.category || ''}"
                     placeholder="e.g. Web, Embedded, IoT…" />
              <div class="form-text">Leave blank to use "General".</div>
              <div class="invalid-feedback" id="err-category"></div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Tech Stack</label>
              <input type="text" id="f-tech" class="form-control" value="${techStr}"
                     placeholder="React, Laravel, MySQL" />
              <div class="form-text">Comma-separated. Each tag max 100 characters.</div>
              <div class="invalid-feedback" id="err-tech_stack"></div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Live URL</label>
              <input type="text" id="f-live" class="form-control" value="${project.live_url || ''}"
                     placeholder="https://your-project.com" />
              <div class="invalid-feedback" id="err-live_url"></div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">GitHub URL</label>
              <input type="text" id="f-github" class="form-control" value="${project.github_url || ''}"
                     placeholder="https://github.com/username/repo" />
              <div class="invalid-feedback" id="err-github_url"></div>
            </div>
            <div>
              <label class="form-label fw-medium">Display Order</label>
              <input type="number" id="f-order" class="form-control" value="${project.order ?? 0}" min="0" />
              <div class="form-text">Lower number = shown first.</div>
              <div class="invalid-feedback" id="err-order"></div>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="admin-form-card">
            <h6 class="fw-semibold mb-3">Featured Image</h6>
            <div class="mb-2">
              <label class="form-label small text-secondary">Image URL</label>
              <input type="text" id="f-image" class="form-control" placeholder="https://…" value="${imgVal}" />
              <div class="invalid-feedback" id="err-featured_image"></div>
            </div>
            <div class="mb-2">
              <label class="form-label small text-secondary">Or upload a file</label>
              <input type="file" id="f-image-upload" class="form-control form-control-sm" accept="image/*" />
              <div class="form-text">JPEG, PNG, WebP, GIF — max 5 MB</div>
            </div>
            <div id="upload-progress" class="d-none mt-2">
              <div class="progress" style="height:4px;">
                <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated w-100"></div>
              </div>
              <div class="text-secondary small mt-1">Uploading…</div>
            </div>
            <img id="img-preview" src="${imgVal}" class="img-fluid rounded mt-2 ${imgVal ? '' : 'd-none'}" alt="preview" />
          </div>

        </div>
      </div>
    </form>
  `;
}

// ── Validation helpers ────────────────────────────────────────────────────────

function clearErrors() {
  document.querySelectorAll('.form-control.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(el => { el.textContent = ''; });
  const errContent = document.getElementById('err-content');
  if (errContent) errContent.classList.add('d-none');
}

function setFieldError(inputId, errDivId, msg) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add('is-invalid');
  const errEl = document.getElementById(errDivId);
  if (errEl) errEl.textContent = msg;
}

function setContentError(msg) {
  const wrap = document.getElementById('err-content');
  const text = document.getElementById('err-content-text');
  if (wrap && text) { text.textContent = msg; wrap.classList.remove('d-none'); }
}

function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

function validateForm(ckEditor) {
  clearErrors();
  let valid = true;

  // Title — required, min 3 chars
  const title = document.getElementById('f-title').value.trim();
  if (!title) {
    setFieldError('f-title', 'err-title', 'Title is required.');
    valid = false;
  } else if (title.length < 3) {
    setFieldError('f-title', 'err-title', 'Title must be at least 3 characters.');
    valid = false;
  }

  // Slug — optional, must be valid format if provided
  const slug = document.getElementById('f-slug').value.trim();
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    setFieldError('f-slug', 'err-slug', 'Slug can only contain lowercase letters, numbers, and hyphens.');
    valid = false;
  }

  // Excerpt — optional, max 500 chars
  const excerpt = document.getElementById('f-excerpt').value.trim();
  if (excerpt.length > 500) {
    setFieldError('f-excerpt', 'err-excerpt', `Excerpt is too long (${excerpt.length}/500 characters).`);
    valid = false;
  }

  // Content — required
  const content = ckEditor ? ckEditor.getData().trim() : '';
  if (!content) {
    setContentError('Content is required. Please write something in the editor.');
    valid = false;
  }

  // Category — optional, max 100 chars
  const category = document.getElementById('f-category').value.trim();
  if (category.length > 100) {
    setFieldError('f-category', 'err-category', 'Category must be under 100 characters.');
    valid = false;
  }

  // Tech stack — each tag max 100 chars
  const techRaw = document.getElementById('f-tech').value.trim();
  if (techRaw) {
    const tags = techRaw.split(',').map(t => t.trim()).filter(Boolean);
    const longTag = tags.find(t => t.length > 100);
    if (longTag) {
      setFieldError('f-tech', 'err-tech_stack', `Tag "${longTag.substring(0, 20)}…" exceeds 100 characters.`);
      valid = false;
    }
  }

  // Live URL — optional, must be valid if provided
  const liveUrl = document.getElementById('f-live').value.trim();
  if (liveUrl && !isValidUrl(liveUrl)) {
    setFieldError('f-live', 'err-live_url', 'Please enter a valid URL (e.g. https://example.com).');
    valid = false;
  }

  // GitHub URL — optional, must be valid if provided
  const githubUrl = document.getElementById('f-github').value.trim();
  if (githubUrl && !isValidUrl(githubUrl)) {
    setFieldError('f-github', 'err-github_url', 'Please enter a valid URL (e.g. https://github.com/…).');
    valid = false;
  }

  // Order — must be a non-negative integer
  const orderVal = document.getElementById('f-order').value;
  const order    = parseInt(orderVal, 10);
  if (orderVal === '' || isNaN(order) || order < 0) {
    setFieldError('f-order', 'err-order', 'Display order must be 0 or a positive number.');
    valid = false;
  }

  return valid;
}

function showBackendErrors(errors) {
  const fieldMap = {
    title:          ['f-title',    'err-title'],
    slug:           ['f-slug',     'err-slug'],
    category:       ['f-category', 'err-category'],
    excerpt:        ['f-excerpt',  'err-excerpt'],
    featured_image: ['f-image',    'err-featured_image'],
    live_url:       ['f-live',     'err-live_url'],
    github_url:     ['f-github',   'err-github_url'],
    order:          ['f-order',    'err-order'],
    tech_stack:     ['f-tech',     'err-tech_stack'],
  };
  Object.entries(errors).forEach(([field, messages]) => {
    if (field === 'content') {
      setContentError(messages[0]);
    } else if (fieldMap[field]) {
      const [inputId, errDivId] = fieldMap[field];
      setFieldError(inputId, errDivId, messages[0]);
    }
  });
}

// ── CKEditor upload adapter ───────────────────────────────────────────────────

function CKUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
    upload: () => loader.file.then(file =>
      uploadImage(file).then(r => ({ default: r.url }))
    ),
    abort: () => {},
  });
}

// ── Main render ───────────────────────────────────────────────────────────────

async function render() {
  if (!initAdminLayout(isEdit ? 'Edit Project' : 'New Project', 'projects')) return;

  const main = document.getElementById('admin-main');

  let project = {};
  if (isEdit) {
    try {
      const projects = await api.adminGetProjects();
      project = projects.find(p => String(p.id) === projectId) || {};
      if (!project.id) {
        main.innerHTML = `<div class="alert alert-danger">Project not found.</div>`;
        return;
      }
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
    if (!slugEl._manuallyEdited) {
      slugEl.value = slugify(titleEl.value);
    }
  });
  slugEl.addEventListener('input', () => { slugEl._manuallyEdited = true; });

  // Featured image upload
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];

  document.getElementById('f-image-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Invalid file type. Please upload a JPEG, PNG, GIF, WebP, SVG, or BMP image.', 'error');
      e.target.value = '';
      return;
    }

    // Validate size before uploading
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      showToast(`Image is too large (${sizeMB} MB). Maximum allowed size is 5 MB.`, 'error');
      e.target.value = '';
      return;
    }

    const progress = document.getElementById('upload-progress');
    progress.classList.remove('d-none');
    try {
      const { url } = await uploadImage(file);
      document.getElementById('f-image').value = url;
      const preview = document.getElementById('img-preview');
      preview.src = url;
      preview.classList.remove('d-none');
      showToast('Image uploaded successfully.', 'success');
    } catch (err) {
      showToast('Image upload failed: ' + err.message, 'error');
    } finally {
      progress.classList.add('d-none');
      e.target.value = '';
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

  // Init CKEditor — load existing content via setData (safe, avoids HTML entity issues)
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
    .then(editor => {
      ckEditor = editor;
      if (project.content) editor.setData(project.content);
    })
    .catch(err => console.error(err));

  // Form submit
  document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(ckEditor)) {
      showToast('Please fix the validation errors before saving.', 'error');
      return;
    }

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${isEdit ? 'Updating…' : 'Creating…'}`;

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
        showToast('Project updated successfully!', 'success');
      } else {
        await api.createProject(payload);
        showToast('Project created! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'projects.html', 1500);
      }
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        showBackendErrors(err.errors);
        showToast('Please fix the highlighted errors.', 'error');
      } else {
        showToast(err.message || 'Something went wrong. Please try again.', 'error');
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<i class="bi bi-save me-1"></i> ${isEdit ? 'Update Project' : 'Create Project'}`;
    }
  });
}

render();
