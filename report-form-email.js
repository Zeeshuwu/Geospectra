class ReportFormEmail {
    constructor() {
        this.maxFiles = 3;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.selectedFiles = [];
        
        
        this.emailConfig = {
            publicKey: 'NuN5Zr8YzeYPEABg8',     
            serviceId: 'service_1ji3snu',     
            templateId: 'template_tmtubc6'    
        };
        
        this.init();
    }

    init() {
        // Initialize EmailJS
        try {
            emailjs.init(this.emailConfig.publicKey);
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
        }
        
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Photo upload functionality
        const photoUpload = document.getElementById('photoUpload');
        const photoInput = document.getElementById('photoInput');

        if (photoUpload && photoInput) {
            photoUpload.addEventListener('click', () => photoInput.click());
            photoUpload.addEventListener('dragover', this.handleDragOver.bind(this));
            photoUpload.addEventListener('dragleave', this.handleDragLeave.bind(this));
            photoUpload.addEventListener('drop', this.handleDrop.bind(this));
            photoInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Form submission
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    setupCharacterCounter() {
        const textarea = document.getElementById('description');
        const charCount = document.getElementById('charCount');

        if (textarea && charCount) {
            textarea.addEventListener('input', () => {
                const count = textarea.value.length;
                charCount.textContent = count;
                
                // Color coding for character count
                if (count > 900) {
                    charCount.style.color = '#ef4444';
                } else if (count > 800) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = '#9ca3af';
                }
            });
        }
    }

    setupFormValidation() {
        // Real-time validation for email
        const emailInput = document.getElementById('userEmail');
        if (emailInput) {
            emailInput.addEventListener('blur', this.validateEmail.bind(this));
        }

        // Real-time validation for name
        const nameInput = document.getElementById('userName');
        if (nameInput) {
            nameInput.addEventListener('blur', this.validateName.bind(this));
        }
    }

    validateEmail(e) {
        const email = e.target.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            e.target.style.borderColor = '#ef4444';
            this.showFieldError(e.target, 'Please enter a valid email address');
        } else {
            e.target.style.borderColor = '#e1e8ed';
            this.hideFieldError(e.target);
        }
    }

    validateName(e) {
        const name = e.target.value.trim();
        
        if (name && name.length < 2) {
            e.target.style.borderColor = '#ef4444';
            this.showFieldError(e.target, 'Name must be at least 2 characters long');
        } else {
            e.target.style.borderColor = '#e1e8ed';
            this.hideFieldError(e.target);
        }
    }

    showFieldError(field, message) {
        // Remove existing error
        this.hideFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem;';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        this.addFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
        e.target.value = ''; // Reset input
    }

    addFiles(files) {
        const remainingSlots = this.maxFiles - this.selectedFiles.length;
        const filesToAdd = files.slice(0, remainingSlots);

        filesToAdd.forEach(file => {
            // Validate file size
            if (file.size > this.maxFileSize) {
                this.showMessage(`File "${file.name}" is too large. Maximum size is 5MB.`, 'error');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showMessage(`File "${file.name}" is not a valid image file.`, 'error');
                return;
            }

            const fileObj = {
                file: file,
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size
            };

            this.selectedFiles.push(fileObj);
            this.createPreview(fileObj);
        });

        this.updateUploadArea();
    }

    createPreview(fileObj) {
        const previewContainer = document.getElementById('previewImages');
        if (!previewContainer) return;

        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.dataset.fileId = fileObj.id;

        const img = document.createElement('img');
        img.className = 'preview-image';
        img.alt = 'Preview';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove image';
        removeBtn.onclick = (e) => {
            e.preventDefault();
            this.removeFile(fileObj.id);
        };

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = () => {
            this.showMessage(`Failed to load preview for "${fileObj.name}"`, 'error');
        };
        reader.readAsDataURL(fileObj.file);

        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewContainer.appendChild(previewItem);
    }

    removeFile(fileId) {
        this.selectedFiles = this.selectedFiles.filter(f => f.id !== fileId);
        
        const previewItem = document.querySelector(`[data-file-id="${fileId}"]`);
        if (previewItem) {
            previewItem.remove();
        }

        this.updateUploadArea();
    }

    updateUploadArea() {
        const photoUpload = document.getElementById('photoUpload');
        if (!photoUpload) return;

        const remainingSlots = this.maxFiles - this.selectedFiles.length;

        if (remainingSlots === 0) {
            photoUpload.style.opacity = '0.5';
            photoUpload.style.pointerEvents = 'none';
        } else {
            photoUpload.style.opacity = '1';
            photoUpload.style.pointerEvents = 'auto';
        }

        // Update text
        const uploadText = photoUpload.querySelector('.upload-text');
        if (uploadText) {
            if (remainingSlots === 0) {
                uploadText.textContent = 'Maximum files reached (3/3)';
            } else {
                uploadText.textContent = `Drop images here or click to select (${this.selectedFiles.length}/${this.maxFiles})`;
            }
        }
    }

    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type = 'info') {
        const messageDiv = type === 'error' ? 
            document.getElementById('errorMessage') : 
            document.getElementById('successMessage');
        
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide after 5 seconds for non-error messages
            if (type !== 'error') {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
        }
    }

    hideMessages() {
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
    }

    validateForm(formData) {
        const errors = [];
        
        const userName = formData.get('user_name')?.trim();
        const userEmail = formData.get('user_email')?.trim();
        const institution = formData.get('institution');
        
        if (!userName || userName.length < 2) {
            errors.push('Please enter a valid name (at least 2 characters)');
        }
        
        if (!userEmail) {
            errors.push('Please enter your email address');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userEmail)) {
                errors.push('Please enter a valid email address');
            }
        }
        
        if (!institution) {
            errors.push('Please select your institution type');
        }
        
        return errors;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitBtn = document.getElementById('submitBtn');
        
        // Hide previous messages
        this.hideMessages();
        
        // Validate form
        const validationErrors = this.validateForm(formData);
        if (validationErrors.length > 0) {
            this.showMessage(validationErrors.join(' • '), 'error');
            return;
        }
        
        // Check EmailJS configuration
        if (!this.emailConfig.publicKey || this.emailConfig.publicKey === 'YOUR_PUBLIC_KEY_HERE') {
            this.showMessage('Email service is not configured. Please contact the administrator.', 'error');
            return;
        }
        
        // Disable submit button and show loading
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Sending Report...';
        
        try {
            // Prepare email data
            const emailData = {
                user_name: formData.get('user_name').trim(),
                user_email: formData.get('user_email').trim(),
                institution: formData.get('institution'),
                description: formData.get('description')?.trim() || 'No description provided',
                severity: formData.get('severity') || 'Medium',
                timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }),
                file_count: this.selectedFiles.length,
                total_file_size: this.selectedFiles.reduce((total, file) => total + file.file.size, 0)
            };
            
            // Add file information
            if (this.selectedFiles.length > 0) {
                emailData.file_list = this.selectedFiles.map(fileObj => 
                    `${fileObj.name} (${this.formatFileSize(fileObj.file.size)})`
                ).join(', ');
                
                emailData.file_details = this.selectedFiles.map((fileObj, index) => 
                    `File ${index + 1}: ${fileObj.name} - ${this.formatFileSize(fileObj.file.size)}`
                ).join('\n');
            } else {
                emailData.file_list = 'No files attached';
                emailData.file_details = 'No files were uploaded with this report.';
            }
            
            // Add browser and system info
            emailData.browser_info = `${navigator.userAgent}`;
            emailData.screen_resolution = `${screen.width}x${screen.height}`;
            emailData.page_url = window.location.href;
            
            console.log('Sending email with data:', emailData);
            
            // Send email using EmailJS
            const response = await emailjs.send(
                this.emailConfig.serviceId,
                this.emailConfig.templateId,
                emailData
            );
            
            console.log('Email sent successfully:', response);
            
            // Show success message
            this.showMessage('✅ Your report has been sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            let errorMsg = '❌ Failed to send your report. Please try again.';
            
            if (error.status === 400) {
                errorMsg = '❌ Invalid email configuration. Please contact support.';
            } else if (error.status === 402) {
                errorMsg = '❌ Email service limit reached. Please try again later.';
            } else if (error.status === 422) {
                errorMsg = '❌ Invalid email template. Please contact support.';
            } else if (error.text && error.text.includes('network')) {
                errorMsg = '❌ Network error. Please check your connection and try again.';
            }
            
            this.showMessage(errorMsg, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    resetForm() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.reset();
        }
        
        // Reset file uploads
        this.selectedFiles = [];
        const previewContainer = document.getElementById('previewImages');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        
        // Reset character counter
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#9ca3af';
        }
        
        // Reset upload area
        this.updateUploadArea();
        
        // Reset severity to medium (default)
        const mediumRadio = document.getElementById('medium');
        if (mediumRadio) {
            mediumRadio.checked = true;
        }
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ReportFormEmail();
        console.log('Report form initialized successfully');
    } catch (error) {
        console.error('Failed to initialize report form:', error);
    }
});
