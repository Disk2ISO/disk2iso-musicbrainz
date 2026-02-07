# Changelog

Alle bedeutenden Änderungen am disk2iso MusicBrainz Provider werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [1.3.0] - 2026-02-07

### Changed

- Kompatibilität mit disk2iso 1.3.0 Service-Struktur
- Installation nach `services/disk2iso-web/` statt `www/`
- Version auf 1.3.0 aktualisiert

## [Unreleased]

### Geplant

- Erweiterte Track-Metadaten (ISRC, Composer)
- AcoustID Fingerprinting als Fallback
- Multi-CD Sets Unterstützung
- Release-Group Informationen

## [1.2.0] - 2026-02-04

### Added

- Initiale Abtrennung als eigenständiges Provider-Modul
- MusicBrainz API v2 Integration
- Disc-ID basierte Album-Suche
- Album-Metadaten (Künstler, Titel, Jahr, Label)
- Track-Informationen (Titel, Künstler, Länge)
- CoverArt Archive Integration
- Provider-Framework Integration
- Manifest-Datei (libmusicbrainz.ini)
- Mehrsprachige Unterstützung (DE, EN, ES, FR)
- Cache-System (30 Tage Standarddauer)
- Rate-Limiting (1 Request/Sekunde)
- Kein API-Key erforderlich

### Changed

- Unabhängiges Repository von disk2iso Core
- Modulare INI-basierte Konfiguration
- Optionale Integration als Provider-Modul

### Fixed

- Keine bekannten Fehler

## [1.0.0] - 2025-XX-XX

### Features

- Erste Version als Teil von disk2iso Core
- Basis-MusicBrainz Integration

---

[Unreleased]: https://github.com/DirkGoetze/disk2iso-musicbrainz/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/DirkGoetze/disk2iso-musicbrainz/releases/tag/v1.2.0
[1.0.0]: https://github.com/DirkGoetze/disk2iso-musicbrainz/releases/tag/v1.0.0
