/**
 * Dependencies Widget (4x1) - MusicBrainz
 * Zeigt MusicBrainz spezifische Tools (Python-Module)
 * Version: 1.0.0
 */

function loadMusicBrainzDependencies() {
    fetch('/api/widgets/musicbrainz/dependencies')
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
    
    // MusicBrainz-spezifische Tools (aus libmusicbrainz.ini [dependencies])
    const musicbrainzTools = [
        { name: 'curl', display_name: 'curl' },
        { name: 'jq', display_name: 'jq' }
    ];
    
    let html = '';
    
    musicbrainzTools.forEach(tool => {
        const software = softwareList.find(s => s.name === tool.name);
        if (software) {
            html += renderSoftwareRow(tool.display_name, software);
        }
    });
    
    if (html === '') {
        html = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #999;">Keine Informationen verfügbar</td></tr>';
    }
    
    tbody.innerHTML = html;
}

function showMusicBrainzDependenciesError() {
    const tbody = document.getElementById('musicbrainz-dependencies-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #e53e3e;">Fehler beim Laden</td></tr>';
}

// Auto-Load
if (document.getElementById('musicbrainz-dependencies-widget')) {
    loadMusicBrainzDependencies();
}
