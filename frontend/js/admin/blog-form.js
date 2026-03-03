// admin/blog-form.js — Create / Edit blog post (CKEditor)

import { initAdminLayout } from './layout.js';
import { api, uploadImage } from '../api.js';

const params = new URLSearchParams(window.location.search);
const blogId  = params.get('id');
const isEdit  = !!blogId;

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function buildForm(blog = {}) {
  const imgVal = blog.featured_image || '';
  return `
    <form id="blog-form" novalidate>
      <div class="row g-4">

        <!-- Left: main content -->
        <div class="col-lg-8">
          <div class="admin-form-card mb-3">
            <div class="mb-3">
              <label class="form-label fw-medium">Title <span class="text-danger">*</span></label>
              <input type="text" id="f-title" class="form-control" value="${blog.title || ''}" required />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Slug</label>
              <input type="text" id="f-slug" class="form-control" value="${blog.slug || ''}" />
              <div class="form-text">Auto-generated from title. Edit if needed.</div>
            </div>
            <div>
              <label class="form-label fw-medium">Excerpt</label>
              <textarea id="f-excerpt" class="form-control" rows="3">${blog.excerpt || ''}</textarea>
            </div>
          </div>

          <div class="admin-form-card">
            <label class="form-label fw-medium mb-2">Content <span class="text-danger">*</span></label>
            <textarea id="f-content">${blog.content || ''}</textarea>
          </div>
        </div>

        <!-- Right: sidebar options -->
        <div class="col-lg-4">

          <!-- Publish -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Publish</h6>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="f-published" ${blog.is_published ? 'checked' : ''} />
              <label class="form-check-label" for="f-published">Published</label>
            </div>
            <button type="submit" class="btn btn-orange rounded-pill w-100 fw-semibold">
              <i class="bi bi-save me-1"></i> ${isEdit ? 'Update Blog' : 'Create Blog'}
            </button>
            ${isEdit ? `<a href="blogs.html" class="btn btn-outline-secondary rounded-pill w-100 mt-2">Cancel</a>` : ''}
          </div>

          <!-- Details -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Details</h6>
            <div class="mb-3">
              <label class="form-label fw-medium">Category</label>
              <input type="text" id="f-category" class="form-control" value="${blog.category || ''}" />
            </div>
            <div>
              <label class="form-label fw-medium">Author</label>
              <input type="text" id="f-author" class="form-control" value="${blog.author || ''}" />
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
  if (!initAdminLayout(isEdit ? 'Edit Blog' : 'New Blog', 'blogs')) return;

  const main = document.getElementById('admin-main');

  let blog = {};
  if (isEdit) {
    try {
      const blogs = await api.adminGetBlogs();
      blog = blogs.find(b => String(b.id) === blogId) || {};
    } catch (e) {
      main.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
      return;
    }
  }

  main.innerHTML = buildForm(blog);

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
          'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
          'undo', 'redo',
        ],
      },
    })
    .then(editor => { ckEditor = editor; })
    .catch(err => console.error(err));

  // Form submit
  document.getElementById('blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true;

    const payload = {
      title:          document.getElementById('f-title').value.trim(),
      slug:           slugEl.value.trim() || slugify(titleEl.value),
      category:       document.getElementById('f-category').value.trim(),
      author:         document.getElementById('f-author').value.trim(),
      excerpt:        document.getElementById('f-excerpt').value.trim(),
      featured_image: document.getElementById('f-image').value.trim(),
      content:        ckEditor ? ckEditor.getData() : '',
      is_published:   document.getElementById('f-published').checked,
    };

    try {
      if (isEdit) {
        await api.updateBlog(blogId, payload);
        showAlert('Blog updated successfully!', 'success');
      } else {
        await api.createBlog(payload);
        showAlert('Blog created! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'blogs.html', 1500);
      }
    } catch (err) {
      showAlert(err.message);
    } finally {
      btn.disabled = false;
    }
  });
}

render();
