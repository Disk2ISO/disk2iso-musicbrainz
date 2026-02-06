#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
============================================================================
disk2iso - Dependencies Widget (4x1) - MusicBrainz
============================================================================
Filepath: www/routes/widgets/dependencies_musicbrainz.py

Beschreibung:
    Flask Blueprint für MusicBrainz-Dependencies-Widget
    - Zeigt MusicBrainz spezifische Software-Abhängigkeiten
    - Nutzt systeminfo_get_software_info() aus libsysteminfo.sh
    - Filtert auf MusicBrainz-spezifische Tools: python-musicbrainzngs, discid, libdiscid
============================================================================
"""

from flask import Blueprint, jsonify
import subprocess
import json
import os
from datetime import datetime

# Blueprint erstellen
dependencies_musicbrainz_bp = Blueprint(
    'dependencies_musicbrainz',
    __name__,
    url_prefix='/api/widgets/musicbrainz'
)

# Pfade
INSTALL_DIR = os.environ.get('DISK2ISO_INSTALL_DIR', '/opt/disk2iso')


def get_software_info():
    """
    Ruft Software-Informationen via Bash-Funktion ab
    Nutzt systeminfo_get_software_info() aus libsysteminfo.sh
    """
    try:
        result = subprocess.run(
            ['bash', '-c', f'source {INSTALL_DIR}/lib/libsysteminfo.sh && systeminfo_get_software_info'],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            return json.loads(result.stdout.strip())
        return {}
    except Exception as e:
        print(f"Fehler beim Abrufen von Software-Informationen: {e}")
        return {}


@dependencies_musicbrainz_bp.route('/dependencies')
def api_dependencies():
    """
    GET /api/widgets/musicbrainz/dependencies
    Liefert MusicBrainz-spezifische Software-Dependencies
    """
    software_info = get_software_info()
    
    # MusicBrainz-spezifische Tools
    musicbrainz_tools = ['musicbrainzngs', 'python-musicbrainzngs', 'discid', 'libdiscid', 'cdparanoia']
    
    # Konvertiere Dictionary in flache Liste und filtere MusicBrainz-Tools
    software_list = []
    for category, tools in software_info.items():
        if isinstance(tools, list):
            for tool in tools:
                if tool.get('name') in musicbrainz_tools:
                    software_list.append(tool)
    
    return jsonify({
        'success': True,
        'software': software_list,
        'timestamp': datetime.now().isoformat()
    })


def register_blueprint(app):
    """Registriert Blueprint in Flask-App"""
    app.register_blueprint(dependencies_musicbrainz_bp)
