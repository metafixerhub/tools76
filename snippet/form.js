document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    // API Endpoint - IMPORTANT: Update this to your Vercel URL once deployed!
    // Example: const API_URL = 'https://your-vercel-app-name.vercel.app/api/submissions';
    const API_URL = 'http://localhost:5000/api/submissions'; 
    const REDIRECT_URL = 'https://tools76.odoo.com/thank-you';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide any previous errors
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';

        // Gather data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle interests array (multiple checkboxes)
        const interests = [];
        const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
        interestCheckboxes.forEach((checkbox) => {
            interests.push(checkbox.value);
        });
        data.interests = interests;
        
        // Handle boolean consent
        data.consentGiven = formData.get('consentGiven') === 'on';

        // Add UTM info if available in URL
        const urlParams = new URLSearchParams(window.location.search);
        data.utmInfo = {
            source: urlParams.get('utm_source') || 'Direct',
            medium: urlParams.get('utm_medium') || '',
            campaign: urlParams.get('utm_campaign') || ''
        };
        data.source = window.location.hostname;

        // Show loading screen
        loadingOverlay.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong. Please try again.');
            }

            // Success - Redirect
            window.location.href = REDIRECT_URL;
            
        } catch (error) {
            // Hide loading, show error
            loadingOverlay.classList.add('hidden');
            submitBtn.disabled = false;
            
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        }
    });
});
