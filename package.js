/* global Package, Npm */
/* eslint-disable prefer-arrow-callback */

Package.describe({
    name: "jaskinn:mimic",
    version: "1.1.1",
    summary:
        "Stub out Meteor collections (forked from hwillson:meteor-stub-collections)",
    documentation: "README.md",
    git: "https://github.com/jaskinn/mimic.git",
    debugOnly: true
});

Npm.depends({
    chai: "4.2.0",
    sinon: "8.0.4",
    "simpl-schema": "1.5.3"
});

Package.onUse(function onUse(api) {
    api.versionsFrom("1.8");
    api.use(["ecmascript", "mongo"]);
    api.mainModule("index.js");
});

Package.onTest(function onTest(api) {
    api.use([
        "jaskinn:mimic",
        "aldeed:collection2@3.0.6",
        "ecmascript",
        "mongo",
        "meteortesting:mocha@1.1.3",
        "matb33:collection-hooks@0.9.1"
    ]);
    api.mainModule("tests.js");
});
