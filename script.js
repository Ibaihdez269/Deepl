document.addEventListener('DOMContentLoaded', () => {
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const sourceLang = document.getElementById('source-lang');
    const targetLang = document.getElementById('target-lang');
    const swapBtn = document.getElementById('swap-languages');
    const loadingIndicator = document.getElementById('loading');

    let timeoutId;

    // Debounce function
    function debounce(func, delay) {
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Translation function
    async function translate() {
        const text = sourceText.value.trim();
        const sl = sourceLang.value;
        const tl = targetLang.value;

        if (!text) {
            targetText.value = '';
            return;
        }

        loadingIndicator.style.display = 'block';

        try {
            // Using MyMemory API (Free, limited usage)
            // Note: For production, a paid API key or backend is required.
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${tl}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.responseData) {
                targetText.value = data.responseData.translatedText;
            } else {
                targetText.value = "Error en la traducción.";
            }
        } catch (error) {
            console.error('Translation error:', error);
            targetText.value = "Error de conexión.";
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Event Listeners
    sourceText.addEventListener('input', debounce(translate, 800)); // 800ms delay

    sourceLang.addEventListener('change', translate);
    targetLang.addEventListener('change', translate);

    swapBtn.addEventListener('click', () => {
        // Swap languages
        const tempLang = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = tempLang;

        // Swap text if there is any
        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText; // This might be overwritten by the translate call, but good for UX

        translate();
    });
});
