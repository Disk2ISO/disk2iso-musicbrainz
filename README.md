# disk2iso MusicBrainz Provider Module

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/DirkGoetze/disk2iso-musicbrainz)](https://github.com/DirkGoetze/disk2iso-musicbrainz/releases)

MusicBrainz Metadata Provider für [disk2iso](https://github.com/DirkGoetze/disk2iso) - liefert Album-/Track-Metadaten für Audio-CDs mit Disc-ID basierter Suche.

## 🚀 Features

- **Disc-ID Suche** - Automatische Erkennung via CD-Disc-ID
- **Album-Metadaten** - Künstler, Album-Titel, Release-Jahr, Label
- **Track-Informationen** - Track-Titel, Künstler, Länge
- **Cover-Art** - Album-Cover von CoverArt Archive
- **MusicBrainz API** - Offene, freie Musikdatenbank
- **Cache-System** - Automatisches Caching für 30 Tage
- **Multi-Language** - Unterstützt 4 Sprachen (DE, EN, ES, FR)
- **Provider-Framework** - Registriert sich beim disk2iso Metadata-Framework
- **Kein API-Key nötig** - Komplett kostenlos und ohne Registrierung

## 📋 Voraussetzungen

- **disk2iso** >= v1.2.0 mit libmetadata.sh ([Installation](https://github.com/DirkGoetze/disk2iso))
- **curl** - Für API-Requests
- **jq** - Für JSON-Parsing
- **cd-discid** oder **libdiscid** - Für Disc-ID Berechnung
- Optional: **cdparanoia** für Audio-CD Ripping

## 📦 Installation

### Automatisch (empfohlen)

```bash
# Download neueste Version
curl -L https://github.com/DirkGoetze/disk2iso-musicbrainz/releases/latest/download/musicbrainz-module.zip -o /tmp/musicbrainz.zip

# Entpacken nach disk2iso
cd /opt/disk2iso
sudo unzip /tmp/musicbrainz.zip

# Service neu starten
sudo systemctl restart disk2iso
sudo systemctl restart disk2iso-web
```

### Manuell

1. Download [neueste Release](https://github.com/DirkGoetze/disk2iso-musicbrainz/releases/latest)
2. Entpacke nach `/opt/disk2iso/`
3. Setze Berechtigungen: `sudo chown -R root:root /opt/disk2iso/`
4. Restart Services: `sudo systemctl restart disk2iso disk2iso-web`

### Via Web-UI (ab v1.3.0)

1. Öffne disk2iso Web-UI
2. Gehe zu **Einstellungen → Module → Metadata Provider**
3. Klicke auf **MusicBrainz → Installieren**

## ⚙️ Konfiguration

### Manifest-Datei

`conf/libmusicbrainz.ini`:

```ini
[module]
name=musicbrainz
version=1.2.0
description=MusicBrainz Metadata Provider für Audio-CDs

[api]
base_url=https://musicbrainz.org/ws/2
coverart_base_url=https://coverartarchive.org
user_agent=disk2iso/1.2.0
timeout=10

[settings]
active=true
cache_enabled=true
cache_duration_days=30
rate_limit_delay=1000
```

### Provider aktivieren/deaktivieren

```bash
# Deaktivieren
sudo nano /opt/disk2iso/conf/libmusicbrainz.ini
# Setze: active=false

# Service neu starten
sudo systemctl restart disk2iso
```

## 🔧 Verwendung

### Automatisch

Der Provider wird automatisch verwendet, wenn:

- Eine Audio-CD eingelegt wird
- libmetadata.sh aktiviert ist
- MusicBrainz als Audio-Provider konfiguriert ist

```bash
# Status prüfen
sudo systemctl status disk2iso

# Provider-Registrierung prüfen
sudo journalctl -u disk2iso -f | grep MusicBrainz
```

### Via Web-UI

1. Öffne <http://your-server:5000>
2. Lege Audio-CD ein
3. **Metadata-Dialog** öffnet sich automatisch
4. Wähle Album aus MusicBrainz-Suchergebnissen
5. Metadaten werden in MP3-Tags gespeichert

### Manuell (API)

```bash
# Suche nach Disc-ID
curl "http://localhost:5000/api/metadata/query?provider=musicbrainz&discid=Wn8eRBtfLDfL0qjYPdxrz.Zjs_U-"

# Response:
{
  "success": true,
  "provider": "musicbrainz",
  "results": [
    {
      "id": "release-mbid",
      "title": "Album Title",
      "artist": "Artist Name",
      "date": "2020",
      "tracks": [...]
    }
  ]
}
```

## 📊 Ausgabe-Struktur

```text
/media/iso/metadata/musicbrainz/
├── cache/
│   ├── Wn8eRBtfLDfL0qjYPdxrz.Zjs_U-.nfo    # Cached Query-Results
│   └── AbC123xyz...nfo
├── covers/
│   ├── release-mbid-123.jpg               # Album-Cover
│   └── release-mbid-456.jpg
└── metadata.json                          # Provider-Statistiken
```

## 🔌 Provider-API

### Registrierung

MusicBrainz registriert sich automatisch beim Metadata-Framework:

```bash
metadata_register_provider "musicbrainz" "audio-cd"
```

### Implementierte Funktionen

- `musicbrainz_query(discid)` - Suche nach Disc-ID
- `musicbrainz_parse(json)` - Parse API-Response
- `musicbrainz_apply(metadata, tracks)` - Speichere Metadaten in MP3s
- `musicbrainz_get_cover(release_id)` - Download Cover-Art

## 🌐 Unterstützte Disc-Typen

- **audio-cd** - Audio-CDs

## 🔑 API-Endpunkte

### MusicBrainz API

- **Disc Lookup**: `GET /discid/{discid}?inc=artist-credits+recordings`
- **Release Details**: `GET /release/{mbid}`
- **CoverArt Archive**: `GET http://coverartarchive.org/release/{mbid}/front`

**Dokumentation:**

- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API)
- [CoverArt Archive API](https://coverartarchive.org/doc/MusicBrainz_API)

### Rate Limiting

MusicBrainz hat strikte Rate Limits:

- **1 Request/Sekunde** (default im Modul konfiguriert)
- Nutze Cache um Requests zu minimieren
- User-Agent ist **erforderlich**

## 🎵 Disc-ID Berechnung

Die Disc-ID wird automatisch beim Einlegen der CD berechnet:

```bash
# Mit cd-discid
cd-discid /dev/cdrom
# Output: Wn8eRBtfLDfL0qjYPdxrz.Zjs_U- 12 ...

# Mit libdiscid
discid /dev/cdrom
```

## 🧪 Entwicklung

### Struktur

```text
disk2iso-musicbrainz/
├── conf/
│   └── libmusicbrainz.ini      # Provider-Manifest
├── lang/
│   ├── libmusicbrainz.de       # Deutsche Übersetzung
│   ├── libmusicbrainz.en       # Englische Übersetzung
│   ├── libmusicbrainz.es       # Spanische Übersetzung
│   └── libmusicbrainz.fr       # Französische Übersetzung
└── lib/
    └── libmusicbrainz.sh       # Haupt-Bibliothek
```

### Lokale Tests

```bash
# In disk2iso-Umgebung testen
cd /opt/disk2iso
source lib/libmetadata.sh
source lib/libmusicbrainz.sh

# Abhängigkeiten prüfen
musicbrainz_check_dependencies

# Test-Query mit Disc-ID
musicbrainz_query "Wn8eRBtfLDfL0qjYPdxrz.Zjs_U-"
```

## 📝 Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für alle Änderungen.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🔗 Links

- [disk2iso Core](https://github.com/DirkGoetze/disk2iso)
- [MusicBrainz](https://musicbrainz.org/)
- [CoverArt Archive](https://coverartarchive.org/)
- [libmetadata Framework](https://github.com/DirkGoetze/disk2iso/blob/main/lib/libmetadata.sh)
- [Audio Module](https://github.com/DirkGoetze/disk2iso-audio) (empfohlen)

## ⚠️ Wichtige Hinweise

- **Kein API-Key nötig**: MusicBrainz ist komplett kostenlos
- **Rate Limits beachten**: 1 Request/Sekunde
- **User-Agent erforderlich**: Wird automatisch gesetzt
- **Cache nutzen**: Reduziert API-Last erheblich
- **Disc-ID Tool nötig**: cd-discid oder libdiscid

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/DirkGoetze/disk2iso-musicbrainz/issues)
- **Diskussionen**: [GitHub Discussions](https://github.com/DirkGoetze/disk2iso-musicbrainz/discussions)
- **MusicBrainz Support**: [MusicBrainz Forums](https://community.metabrainz.org/)
- **Core Projekt**: [disk2iso](https://github.com/DirkGoetze/disk2iso)
