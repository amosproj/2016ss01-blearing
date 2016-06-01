angular.module('app.services', [])
    .factory("settings", [function () {
        // Central settings object containing the settings. Its initialized by querying the settings

        // if settings found in local storage have a version smaller
        // minCompatibleSettingsVersion they will be cleared.
        // REMEMBER: increase minCompatibleSettingsversion and settings-version in the
        // settings-Object if you change the settings object!
        var minCompatibleSettingsVersion = 2;
        var settings = {
          "settings-version": 2,
           "reconnect": false,
           "duration": 5,
           "volume": 50,
           "volumeProfiles": [
             { name: "Home",    volume: 40 },
             { name: "Office",  volume: 70 },
             { name: "Outdoor", volume: 90 }
           ],
           "currentVolumeProfile": false,
           "mute": false,
           "volBeforeMute": 50
         };

        var storedSettingsVersion = JSON.parse(localStorage.getItem("settings-version"))
        if (storedSettingsVersion == null || storedSettingsVersion < minCompatibleSettingsVersion) {
          localStorage.clear();
          console.log("Settings stored are incompatible with the current app version and",
              "were therefore deleted.");
        }
        // Function to set settings into Localstorage
        function setSetting(name, value) {
          // Save to local storage as stringified objects. so parsing of e.g. boolean is
          // much easier
          localStorage.setItem(name, JSON.stringify(value));
        }

        // Function to query settings by name
        // TODO: Use settings setter to persist directly on set from view!?!
        // see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
        function getSetting(name) {
            var ret = localStorage.getItem(name);
            // Set Default-Value
            try {
              if (ret == null) {
                throw("wrong setting");
              } else {
                ret = JSON.parse(ret);
              }
            } catch (err) {
              // Catches wrong settings and parse Errors.
              console.log("could not get setting " + name + " from local storage!");
              ret = settings[name];
              setSetting(name, ret);
            }

            return ret;
        }

        // Initialize settings!
        //settings.getOwnPropertyNames().forEach((item) => {
        for (item in settings) {
          settings[item] = getSetting(item);
        }

        // Persist all settings
        function persistSettings() {
          //settings.getOwnPropertyNames().forEach((item) => {
          for (item in settings) {
            setSetting(item, settings[item]);
          }
        }

        // Return this services interface
        return {
            getSetting: getSetting,
            setSetting: setSetting,
            persistSettings: persistSettings,
            settings: settings
        };

    }])
   .factory("dataStorage", [function() {
	//TODO Use LokiDB with LokiCordovaFSAdapter
	var dataStorage = {};


	// This function stores data in the database.
	// The current implementation is just a stub
	function storeData(type, data)
	{
    if(dataStorage[type] === undefined)
    {
      dataStorage[type] = [];
    }
		dataStorage[type].push(data);
	}

	return {
		data: dataStorage,
		storeData: storeData
	}
    }]);
