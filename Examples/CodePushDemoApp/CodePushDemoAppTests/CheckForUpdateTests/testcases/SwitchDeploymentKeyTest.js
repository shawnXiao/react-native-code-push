"use strict";

var React = require("react-native");
var CodePush = require("react-native-code-push");
var NativeCodePush = React.NativeModules.CodePush;
var createTestCaseComponent = require("../../utils/createTestCaseComponent");
var PackageMixins = require("react-native-code-push/package-mixins.js")(NativeCodePush);
var assert = require("assert");
var createMockAcquisitionSdk = require("../../utils/mockAcquisitionSdk");

var serverPackage = {
  appVersion: "1.5.0",
  description: "Angry flappy birds",
  downloadUrl: "http://www.windowsazure.com/blobs/awperoiuqpweru",
  isAvailable: true,
  isMandatory: false,
  packageHash: "hash240",
  packageSize: 1024,
  updateAppVersion: false
};
var localPackage = {};
var deploymentKey = "myKey123";

var SwitchDeploymentKeyTest = createTestCaseComponent(
  "SwitchDeploymentKeyTest",
  "should check for an update under the specified deployment key",
  () => {
    var mockAcquisitionSdk = createMockAcquisitionSdk(serverPackage, localPackage, deploymentKey);       
    var mockConfiguration = { appVersion : "1.5.0" };
    CodePush.setUpTestDependencies(mockAcquisitionSdk, mockConfiguration, NativeCodePush);
    CodePush.getCurrentPackage = function () {
      return Promise.resolve(localPackage);
    }
    return Promise.resolve();
  },
  () => {
    return CodePush.checkForUpdate(deploymentKey)
      .then((update) => {
        if (update) {
          assert.deepEqual(update, Object.assign(serverPackage, PackageMixins.remote));
        } else {
          throw new Error("checkForUpdate did not return the update from the server");
        }
      });
  }
);

module.exports = SwitchDeploymentKeyTest;