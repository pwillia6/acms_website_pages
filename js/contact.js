// /Users/user/Volumes/acms2/acms.cweb.com.au/pages/js/contact.js

/**
 * Handles the contact form submission.
 * @param {Event} e - The form submission event.
 */
async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = document.getElementById('contact-btn-text');
    const spinner = document.getElementById('contact-spinner');

    // Basic validation
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !email || !subject || !message) {
        showToast('Validation Error', 'Please fill out all fields.', false);
        return;
    }

    // Disable button and show spinner
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    spinner.classList.remove('hidden');

    try {
        const response = await fetch('process_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'An unknown server error occurred.');
        }

        // On success, hide the form and show the confirmation message in its place.
        const formContainer = form.parentElement;
        if (formContainer) {
            formContainer.innerHTML = `
                <div class="text-center p-4">
                    <i class="fa-solid fa-circle-check text-5xl text-brandGreen-400 mb-4"></i>
                    <h3 class="text-xl font-serif font-bold text-stone-100">Message Sent!</h3>
                    <p class="mt-2 text-stone-300">${result.message}</p>
                </div>`;
        }

    } catch (error) {
        console.error('Contact form submission error:', error);
        // Re-enable button and hide spinner
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        spinner.classList.add('hidden');

        showToast('Submission Failed', error.message, false);
    }
}

/**
 * Attaches event listeners for the Contact page.
 */
function setupContactPageListeners() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    // Assuming setActiveTab is a global function from another script
    if (typeof setActiveTab === 'function') {
        setActiveTab('contact');
    }
    setupContactPageListeners();
});