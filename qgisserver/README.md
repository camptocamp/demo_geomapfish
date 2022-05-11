To edit the project you needs the QGIS extensions (Trackable QGIS Project)[https://github.com/opengisch/qgis_trackable_project_files].

To install it run:

Flatpack:
* Start QGIS
* Run:
  ```
  flatpak enter org.qgis.qgis bash
  python -m ensurepip --upgrade
  python -m pip install lxml
  ```
* Restart QGIS
* Install the plugin

