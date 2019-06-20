/* global Package, Npm */
/* eslint-disable prefer-arrow-callback */

Package.describe({
    name: 'jaskinn:mimic',
    version: '1.0.10',
    summary:
        'Stub out Meteor collections with in-memory local collections. (forked from hwillson:meteor-stub-collections)',
    documentation: 'README.md',
    git: 'https://github.com/jaskinn/mimic.git',
    debugOnly: true,
})

Npm.depends({
    chai: '4.2.0',
    sinon: '7.3.2',
})

Package.onUse(function onUse(api) {
    api.versionsFrom('1.8')
    api.use(['ecmascript', 'mongo'])
    api.mainModule('index.js')
})

Package.onTest(function onTest(api) {
    api.use([
        'jaskinn:mimic',
        'aldeed:collection2@3.0.1',
        'ecmascript',
        'mongo',
        'lmieulet:meteor-coverage@3.2.0',
        'meteortesting:mocha@1.1.2',
    ])
    api.mainModule('tests.js')
})
