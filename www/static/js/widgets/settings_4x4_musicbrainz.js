/**
 * disk2iso - Settings Widget (4x1) - MusicBrainz
 * Lädt MusicBrainz Einstellungen dynamisch
 */

let musicbrainzSaveTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    // Lade Widget-Content via AJAX
    fetch('/api/widgets/musicbrainz/settings')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('musicbrainz-settings-container');
            if (container) {
                container.innerHTML = html;
                initMusicbrainzSettingsWidget();
            }
        })
        .catch(error => console.error('Fehler beim Laden der MusicBrainz Settings:', error));
});

function initMusicbrainzSettingsWidget() {
    const activeCheckbox = document.getElementById('musicbrainz_active');
    const cacheCheckbox = document.getElementById('musicbrainz_cache_enabled');
    const settingsDiv = document.getElementById('musicbrainz-settings');
    const cacheSettingsDiv = document.getElementById('musicbrainz-cache-settings');
    
    if (activeCheckbox) {
        activeCheckbox.addEventListener('change', function() {
            if (settingsDiv) {
                settingsDiv.style.display = this.checked ? 'block' : 'none';
            }
            saveMusicbrainzSettings();
        });
    }
    
    if (cacheCheckbox) {
        cacheCheckbox.addEventListener('change', function() {
            if (cacheSettingsDiv) {
                cacheSettingsDiv.style.display = this.checked ? 'block' : 'none';
            }
            saveMusicbrainzSettings();
        });
    }
    
    // Auto-save bei Änderungen (blur + change für bessere UX)
    const cacheDurationInput = document.getElementById('musicbrainz_cache_duration');
    const rateLimitInput = document.getElementById('musicbrainz_rate_limit');
    
    if (cacheDurationInput) {
        cacheDurationInput.addEventListener('blur', saveMusicbrainzSettings);
        cacheDurationInput.addEventListener('change', saveMusicbrainzSettings);
    }
    
    if (rateLimitInput) {
        rateLimitInput.addEventListener('blur', saveMusicbrainzSettings);
        rateLimitInput.addEventListener('change', saveMusicbrainzSettings);
    }
}

function saveMusicbrainzSettings() {
    // Debounce: Warte 500ms nach letzter Änderung
    if (musicbrainzSaveTimeout) {
        clearTimeout(musicbrainzSaveTimeout);
    }
    
    musicbrainzSaveTimeout = setTimeout(() => {
        saveMusicbrainzSettingsNow();
    }, 500);
}

function saveMusicbrainzSettingsNow() {
    const active = document.getElementById('musicbrainz_active')?.checked || false;
    const cacheEnabled = document.getElementById('musicbrainz_cache_enabled')?.checked || false;
    const cacheDuration = parseInt(document.getElementById('musicbrainz_cache_duration')?.value) || 30;
    const rateLimit = parseInt(document.getElementById('musicbrainz_rate_limit')?.value) || 1000;
    
    const data = {
        active: active,
        cache_enabled: cacheEnabled,
        cache_duration_days: cacheDuration,
        rate_limit_delay: rateLimit
    };
    
    fetch('/api/widgets/musicbrainz/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showNotification('MusicBrainz Einstellungen gespeichert', 'success');
        } else {
            showNotification('Fehler beim Speichern: ' + result.error, 'error');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        showNotification('Fehler beim Speichern der Einstellungen', 'error');
    });
}
