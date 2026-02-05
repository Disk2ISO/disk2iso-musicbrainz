"""
disk2iso - MusicBrainz Widget Settings Routes
Stellt die MusicBrainz-Einstellungen bereit (Settings Widget)
"""

import os
import sys
import configparser
from flask import Blueprint, render_template, jsonify, request
from i18n import t

# Blueprint für MusicBrainz Settings Widget
musicbrainz_settings_bp = Blueprint('musicbrainz_settings', __name__)

def get_musicbrainz_ini_path():
    """Ermittelt den Pfad zur libmusicbrainz.ini"""
    return '/opt/disk2iso-musicbrainz/conf/libmusicbrainz.ini'

def get_musicbrainz_settings():
    """
    Liest die MusicBrainz-Einstellungen aus libmusicbrainz.ini [settings]
    """
    try:
        ini_path = get_musicbrainz_ini_path()
        
        settings = {
            "enabled": True,
            "active": True,
            "cache_enabled": True,
            "cache_duration_days": 30,
            "rate_limit_delay": 1000
        }
        
        if os.path.exists(ini_path):
            parser = configparser.ConfigParser()
            parser.read(ini_path)
            
            if parser.has_section('settings'):
                settings['enabled'] = parser.getboolean('settings', 'enabled', fallback=True)
                settings['active'] = parser.getboolean('settings', 'active', fallback=True)
                settings['cache_enabled'] = parser.getboolean('settings', 'cache_enabled', fallback=True)
                settings['cache_duration_days'] = parser.getint('settings', 'cache_duration_days', fallback=30)
                settings['rate_limit_delay'] = parser.getint('settings', 'rate_limit_delay', fallback=1000)
        
        return settings
        
    except Exception as e:
        print(f"Fehler beim Lesen der MusicBrainz-Einstellungen: {e}", file=sys.stderr)
        return {
            "enabled": True,
            "active": True,
            "cache_enabled": True,
            "cache_duration_days": 30,
            "rate_limit_delay": 1000
        }

def save_musicbrainz_settings(data):
    """
    Speichert MusicBrainz-Einstellungen in libmusicbrainz.ini [settings]
    """
    try:
        ini_path = get_musicbrainz_ini_path()
        
        if not os.path.exists(ini_path):
            return False, "INI-Datei nicht gefunden"
        
        parser = configparser.ConfigParser()
        parser.read(ini_path)
        
        if not parser.has_section('settings'):
            parser.add_section('settings')
        
        # Aktualisiere Werte
        if 'active' in data:
            parser.set('settings', 'active', 'true' if data['active'] else 'false')
        if 'cache_enabled' in data:
            parser.set('settings', 'cache_enabled', 'true' if data['cache_enabled'] else 'false')
        if 'cache_duration_days' in data:
            parser.set('settings', 'cache_duration_days', str(data['cache_duration_days']))
        if 'rate_limit_delay' in data:
            parser.set('settings', 'rate_limit_delay', str(data['rate_limit_delay']))
        
        # Schreibe zurück
        with open(ini_path, 'w') as f:
            parser.write(f)
        
        return True, "Einstellungen gespeichert"
        
    except Exception as e:
        return False, str(e)

@musicbrainz_settings_bp.route('/api/widgets/musicbrainz/settings', methods=['GET'])
def api_musicbrainz_settings_widget():
    """
    Rendert das MusicBrainz Settings Widget
    """
    config = get_musicbrainz_settings()
    
    return render_template('widgets/musicbrainz_widget_settings.html',
                         settings=settings,
                         t=t)

@musicbrainz_settings_bp.route('/api/widgets/musicbrainz/settings', methods=['POST'])
def api_save_musicbrainz_settings():
    """
    Speichert MusicBrainz-Einstellungen
    """
    try:
        data = request.get_json()
        success, message = save_musicbrainz_settings(data)
        
        if success:
            return jsonify({"success": True, "message": message})
        else:
            return jsonify({"success": False, "error": message}), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

