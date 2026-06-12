// /Users/user/Volumes/acms2/acms.cweb.com.au/pages/js/playing-days-regions.js

let allEventsData = [];

/**
 * Renders the Sydney playing day schedule.
 */
function renderSydneySchedule() {
    const container = document.getElementById('sydney-schedule-body');
    if (!container) return;
    const events = allEventsData.filter(e => e.type === 'playing-day' && e.region === 'sydney');
    
    let content = '';
    if (events.length > 0) {
        events.forEach(e => {
            const statusClass = e.status === 'Completed' ? 'bg-green-100 text-green-800' : (e.status === 'Enrolling Soon' ? 'bg-brandTeal-100 text-brandTeal-800' : 'bg-stone-100 text-stone-600');
            content += `
                <tr class="hover:bg-stone-50">
                    <td class="p-4 font-semibold text-stone-900">${e.date}</td>
                    <td class="p-4">${e.venue || ''}</td>
                    <td class="p-4"><span class="px-2 py-0.5 ${statusClass} rounded-full text-xs">${e.status}</span></td>
                    <td class="p-4 ${e.status === 'Completed' ? 'text-stone-400' : ''}">${e.registration_closes}</td>
                </tr>
            `;
        });
    } else {
        content = '<tr><td colspan="4" class="p-4 text-center text-stone-500">No scheduled events for Sydney.</td></tr>';
    }
    container.innerHTML = content;
}

/**
 * Renders the Canberra playing day schedule.
 */
function renderCanberraSchedule() {
    const container = document.getElementById('canberra-schedule-body');
    if (!container) return;
    const events = allEventsData.filter(e => e.type === 'playing-day' && e.region === 'canberra');

    let content = '';
    if (events.length > 0) {
        // Group by coordinator to use rowspan
        const groupedByCoordinator = events.reduce((acc, e) => {
            const coord = e.coordinator || 'N/A';
            if (!acc[coord]) {
                acc[coord] = [];
            }
            acc[coord].push(e);
            return acc;
        }, {});

        for (const coordinator in groupedByCoordinator) {
            const groupEvents = groupedByCoordinator[coordinator];
            groupEvents.forEach((e, index) => {
                content += `
                    <tr class="hover:bg-stone-50">
                        <td class="p-4 font-semibold">${e.date}</td>
                        <td class="p-4">${e.registration_closes}</td>
                        ${index === 0 ? `<td class="p-4 text-xs text-stone-500" rowspan="${groupEvents.length}">${coordinator}</td>` : ''}
                    </tr>
                `;
            });
        }
    } else {
        content = '<tr><td colspan="3" class="p-4 text-center text-stone-500">No scheduled events for Canberra.</td></tr>';
    }
    container.innerHTML = content;
}

/**
 * Renders the Brisbane playing day schedule.
 */
function renderBrisbaneSchedule() {
    const container = document.getElementById('brisbane-schedule-body');
    if (!container) return;
    const events = allEventsData.filter(e => e.type === 'playing-day' && e.region === 'brisbane');

    let content = '';
    if (events.length > 0) {
        events.forEach(e => {
            const statusClass = e.status === 'Completed' ? 'text-green-700' : 'text-brandTeal-600';
            content += `
                <tr class="hover:bg-stone-50">
                    <td class="p-4 font-semibold">${e.date}</td>
                    <td class="p-4">${e.registration_closes}</td>
                    <td class="p-4 text-xs ${statusClass}">${e.status}</td>
                </tr>
            `;
        });
    } else {
        content = '<tr><td colspan="3" class="p-4 text-center text-stone-500">No scheduled events for Brisbane.</td></tr>';
    }
    container.innerHTML = content;
}

/**
 * Renders the Blue Mountains playing day schedule.
 */
function renderBlueMountainsSchedule() {
    const container = document.getElementById('blue-mountains-schedule-container');
    if (!container) return;
    const events = allEventsData.filter(e => e.type === 'playing-day' && e.region === 'blue');

    if (events.length > 0) {
        const dates = events.map(e => `<li>&bull; ${e.date}</li>`).join('');
        container.innerHTML = `<ul class="space-y-2 text-sm font-semibold text-stone-800">${dates}</ul>`;
    } else {
        container.innerHTML = `<p class="text-sm text-stone-500">No scheduled events for the Blue Mountains.</p>`;
    }
}

async function initializeRegionData() {
    try {
        allEventsData = await fetchJSON('data/events-data.json') || [];
        
        if (document.getElementById('sydney-schedule-body')) renderSydneySchedule();
        if (document.getElementById('canberra-schedule-body')) renderCanberraSchedule();
        if (document.getElementById('brisbane-schedule-body')) renderBrisbaneSchedule();
        if (document.getElementById('blue-mountains-schedule-container')) renderBlueMountainsSchedule();

    } catch (error) {
        console.error("Could not fetch playing days event data:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveTab('playing');
    initializeRegionData();
});