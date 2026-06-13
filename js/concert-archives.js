document.addEventListener('DOMContentLoaded', function() {
    setActiveTab('concerts');

    const dataSourceMeta = document.querySelector('meta[name="data-source"]');
    const container = document.getElementById('archives-container');

    if (!dataSourceMeta || !container) {
        console.error('Required elements for concert archives page not found.');
        if (container) {
            container.innerHTML = `<p class="p-4 text-center text-red-500">Page is missing required elements for script.</p>`;
        }
        return;
    }

    async function fetchJSON(url) {
        // Add a cache-busting parameter to ensure the latest data is always fetched.
        const cacheBustingUrl = new URL(url, window.location.href);
        cacheBustingUrl.searchParams.set('v', new Date().getTime());

        const response = await fetch(cacheBustingUrl.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
        }
        return await response.json();
    }

    async function renderArchives() {
        try {
            const archives = await fetchJSON(dataSourceMeta.content);

            if (archives.length === 0) {
                container.innerHTML = `<p class="text-center text-stone-500">No concert archives found.</p>`;
                return;
            }

            // Group archives by year
            const archivesByYear = archives.reduce((acc, item) => {
                const year = new Date(item.date).getFullYear();
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(item);
                return acc;
            }, {});

            // Get sorted years (descending)
            const sortedYears = Object.keys(archivesByYear).sort((a, b) => b - a);

            let htmlContent = '';

            for (const year of sortedYears) {
                const yearArchives = archivesByYear[year];
                // Sort archives within the year by date descending
                yearArchives.sort((a, b) => new Date(b.date) - new Date(a.date));

                const tableRows = yearArchives.map(item => {
                    const formattedDate = new Date(item.date).toLocaleDateString('en-AU', {
                        month: 'long',
                        year: 'numeric'
                    });

                    const fileLinks = item.files.map(file =>
                        `<a href="${file.url}" class="text-brandGreen-700 hover:underline" target="_blank">${file.label}</a>`
                    ).join('<br>');

                    return `
                        <tr class="hover:bg-stone-50">
                            <td class="p-4 align-top font-semibold text-stone-900 whitespace-nowrap">${formattedDate}</td>
                            <td class="p-4 align-top text-xs">${item.summary}</td>
                            <td class="p-4 align-top text-xs whitespace-nowrap">${fileLinks}</td>
                        </tr>
                    `;
                }).join('');

                htmlContent += `
                    <div class="space-y-4">
                        <h4 class="text-lg font-serif font-bold text-stone-900 border-b border-stone-200 pb-2">${year}</h4>
                        <div class="overflow-x-auto bg-white rounded-xl border border-stone-200 shadow-sm">
                            <table class="w-full text-left border-collapse text-sm">
                                <thead class="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th class="p-4 border-b">Date</th>
                                        <th class="p-4 border-b">Summary</th>
                                        <th class="p-4 border-b">Downloads</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-stone-150">
                                    ${tableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = htmlContent;

        } catch (error) {
            console.error('Error loading concert archives:', error);
            container.innerHTML = `<p class="p-4 text-center text-red-500">Could not load archive data. ${error.message}</p>`;
        }
    }

    renderArchives();
});