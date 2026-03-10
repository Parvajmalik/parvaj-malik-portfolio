// admin/blog-form.js — Create / Edit blog post (CKEditor)

import { initAdminLayout } from './layout.js';
import { api, uploadImage } from '../api.js';
import { showToast } from '../toast.js';

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
              <input type="text" id="f-title" class="form-control" value="${blog.title || ''}"
                     placeholder="Enter blog title" />
              <div class="invalid-feedback" id="err-title"></div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Slug</label>
              <input type="text" id="f-slug" class="form-control" value="${blog.slug || ''}"
                     placeholder="auto-generated-from-title" />
              <div class="form-text">Auto-generated from title. Lowercase letters, numbers and hyphens only.</div>
              <div class="invalid-feedback" id="err-slug"></div>
            </div>
            <div>
              <label class="form-label fw-medium">Excerpt</label>
              <textarea id="f-excerpt" class="form-control" rows="3"
                        placeholder="Short summary shown in blog listing…">${blog.excerpt || ''}</textarea>
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
              <input class="form-check-input" type="checkbox" id="f-published" ${blog.is_published ? 'checked' : ''} />
              <label class="form-check-label" for="f-published">Published</label>
            </div>
            <button type="submit" class="btn btn-orange rounded-pill w-100 fw-semibold" id="submit-btn">
              <i class="bi bi-save me-1"></i> ${isEdit ? 'Update Blog' : 'Create Blog'}
            </button>
            ${isEdit ? `<a href="blogs.html" class="btn btn-outline-secondary rounded-pill w-100 mt-2">Cancel</a>` : ''}
          </div>

          <!-- Details -->
          <div class="admin-form-card mb-3">
            <h6 class="fw-semibold mb-3">Details</h6>
            <div class="mb-3">
              <label class="form-label fw-medium">Category</label>
              <input type="text" id="f-category" class="form-control" value="${blog.category || ''}"
                     placeholder="e.g. Technology, Tutorial…" />
              <div class="form-text">Leave blank to use "General".</div>
              <div class="invalid-feedback" id="err-category"></div>
            </div>
            <div>
              <label class="form-label fw-medium">Author</label>
              <input type="text" id="f-author" class="form-control" value="${blog.author || ''}"
                     placeholder="e.g. Parvej Malik" />
              <div class="form-text">Leave blank to use your name.</div>
              <div class="invalid-feedback" id="err-author"></div>
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

  // Slug — optional, but must be valid format if provided
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

  // Category — max 100 chars if provided
  const category = document.getElementById('f-category').value.trim();
  if (category.length > 100) {
    setFieldError('f-category', 'err-category', 'Category must be under 100 characters.');
    valid = false;
  }

  // Author — max 100 chars if provided
  const author = document.getElementById('f-author').value.trim();
  if (author.length > 100) {
    setFieldError('f-author', 'err-author', 'Author name must be under 100 characters.');
    valid = false;
  }

  return valid;
}

function showBackendErrors(errors) {
  const fieldMap = {
    title:          ['f-title',    'err-title'],
    slug:           ['f-slug',     'err-slug'],
    category:       ['f-category', 'err-category'],
    author:         ['f-author',   'err-author'],
    excerpt:        ['f-excerpt',  'err-excerpt'],
    featured_image: ['f-image',    'err-featured_image'],
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
  if (!initAdminLayout(isEdit ? 'Edit Blog' : 'New Blog', 'blogs')) return;

  const main = document.getElementById('admin-main');

  let blog = {};
  if (isEdit) {
    try {
      const blogs = await api.adminGetBlogs();
      blog = blogs.find(b => String(b.id) === blogId) || {};
      if (!blog.id) {
        main.innerHTML = `<div class="alert alert-danger">Blog not found.</div>`;
        return;
      }
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
          'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
          'undo', 'redo',
        ],
      },
    })
    .then(editor => {
      ckEditor = editor;
      if (blog.content) editor.setData(blog.content);
    })
    .catch(err => console.error(err));

  // Form submit
  document.getElementById('blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(ckEditor)) {
      showToast('Please fix the validation errors before saving.', 'error');
      return;
    }

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${isEdit ? 'Updating…' : 'Creating…'}`;

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
        showToast('Blog updated successfully!', 'success');
      } else {
        await api.createBlog(payload);
        showToast('Blog created! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'blogs.html', 1500);
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
      btn.innerHTML = `<i class="bi bi-save me-1"></i> ${isEdit ? 'Update Blog' : 'Create Blog'}`;
    }
  });
}

render();
