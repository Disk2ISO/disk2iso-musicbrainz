/**
 * MusicBrainz Module - Dependencies Widget (4x1)
 * Zeigt MusicBrainz spezifische Tools (Python-Module)
 * Version: 1.0.0
 */

function loadMusicBrainzDependencies() {
    fetch('/api/system')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.software) {
                updateMusicBrainzDependencies(data.software);
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden der MusicBrainz-Dependencies:', error);
            showMusicBrainzDependenciesError();
        });
}

function updateMusicBrainzDependencies(softwareList) {
    const tbody = document.getElementById('musicbrainz-dependencies-tbody');
    if (!tbody) return;
    
    // MusicBrainz-spezifische Tools (Python-basiert)
    const musicbrainzTools = [
        { name: 'python', display_name: 'Python' },
        { name: 'musicbrainzngs', display_name: 'musicbrainzngs (Python)' }
    ];
    
    let html = '';
    
    musicbrainzTools.forEach(tool => {
        const software = softwareList.find(s => s.name === tool.name);
        if (software) {
            const statusBadge = getStatusBadge(software);
            const rowClass = !software.installed_version ? 'row-inactive' : '';
            
            html += `
                <tr class="${rowClass}">
                    <td><strong>${tool.display_name}</strong></td>
                    <td>${software.installed_version || '<em>Nicht installiert</em>'}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        }
    });
    
    if (html === '') {
        html = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #999;">Keine Informationen verfügbar</td></tr>';
    }
    
    tbody.innerHTML = html;
}

function showMusicBrainzDependenciesError() {
    const tbody = document.getElementById('musicbrainz-dependencies-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #e53e3e;">Fehler beim Laden</td></tr>';
}

// Auto-Load
if (document.getElementById('musicbrainz-dependencies-widget')) {
    loadMusicBrainzDependencies();
}
