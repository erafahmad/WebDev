document.addEventListener('DOMContentLoaded', function () {
    // Form navigation variables
    const formPages = document.querySelectorAll('.form-page');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitButton = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const successMessage = document.getElementById('success-message');
    const form = document.getElementById('survey-form');
    const newSurveyBtn = document.getElementById('new-survey-btn');

    let currentPage = 0;
    const totalPages = formPages.length;

    // Initialize form
    updateProgressBar();
    showPage(currentPage);

    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (validateCurrentPage()) {
                currentPage++;
                showPage(currentPage);
                updateProgressBar();
            }
        });
    });

    // Previous button click handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentPage--;
            showPage(currentPage);
            updateProgressBar();
        });
    });

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateCurrentPage()) {
            // Simulate form submission (in a real app, you would send to a server)
            setTimeout(() => {
                form.style.display = 'none';
                successMessage.style.display = 'block';
                document.querySelector('.progress-container').style.display = 'none';
            }, 1000);
        }
    });

    // New survey button handler
    newSurveyBtn.addEventListener('click', function () {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
        document.querySelector('.progress-container').style.display = 'block';
        currentPage = 0;
        showPage(currentPage);
        updateProgressBar();

        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    });

    // Show the current page and hide others
    function showPage(pageIndex) {
        formPages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.display = 'block';

                // Add animation to form groups
                const formGroups = page.querySelectorAll('.form-group');
                formGroups.forEach((group, i) => {
                    group.style.animationDelay = `${i * 0.1}s`;
                });
            } else {
                page.style.display = 'none';
            }
        });
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentPage + 1) / totalPages) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Validate current page before proceeding
    function validateCurrentPage() {
        let isValid = true;
        const currentPageEl = formPages[currentPage];

        // Validate required fields on page 1
        if (currentPage === 0) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');

            // Reset errors
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            nameInput.style.borderColor = '#ddd';
            emailInput.style.borderColor = '#ddd';

            // Validate name
            if (!nameInput.value.trim()) {
                nameError.style.display = 'block';
                nameInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.style.display = 'block';
                emailInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
        }

        // Validate rating on page 3
        if (currentPage === 2) {
            const ratingSelected = currentPageEl.querySelector('input[name="satisfaction"]:checked');
            const recommendSelected = currentPageEl.querySelector('input[name="recommend"]:checked');
            const ratingError = document.getElementById('rating-error');
            const recommendError = document.getElementById('recommend-error');

            // Reset errors
            ratingError.style.display = 'none';
            recommendError.style.display = 'none';

            if (!ratingSelected) {
                ratingError.style.display = 'block';
                isValid = false;
            }

            if (!recommendSelected) {
                recommendError.style.display = 'block';
                isValid = false;
            }
        }

        return isValid;
    }

    // Add input validation in real-time
    document.getElementById('name').addEventListener('input', function () {
        const error = document.getElementById('name-error');
        if (this.value.trim()) {
            error.style.display = 'none';
            this.style.borderColor = '#ddd';
        }
    });

    document.getElementById('email').addEventListener('input', function () {
        const error = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            error.style.display = 'none';
            this.style.borderColor = '#ddd';
        }
    });

    // Phone number formatting
    document.getElementById('phone').addEventListener('input', function (e) {
        let phoneNumber = this.value.replace(/\D/g, '');
        if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        } else if (phoneNumber.length > 6) {
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
        }
        this.value = phoneNumber;
    });
});