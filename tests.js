/* eslint-env mocha */

import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { expect } from 'chai'

import Mimic from './index'

const widgets = new Mongo.Collection('widgets')
const localWidgets1 = new Mongo.Collection(null)
const localWidgets2 = new Mongo.Collection(null)

// 13JUN19 JS
// TODO: add schema support back in
// const schema = { schemaKey: { type: String, optional: true } };
// widgets.attachSchema(new SimpleSchema(schema));

if (Meteor.isServer) {
    widgets.remove({})
    widgets.insert({})
    Meteor.publish('widgets', function allWidgets() {
        return widgets.find()
    })
} else {
    Meteor.subscribe('widgets')
}

describe('Mimic', function() {
    it('should stub added/registered collections', function() {
        expect(widgets.find().count()).to.equal(1)

        Mimic.shimmer(widgets)
        expect(widgets.find().count()).to.equal(0)

        widgets.insert({})
        widgets.insert({})
        expect(widgets.find().count()).to.equal(2)

        Mimic.restore()
        expect(widgets.find().count()).to.equal(1)
    })

    xit('should stub the schema of a collection', function() {
        expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey')
        Mimic.stub([widgets])
        expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey')
        Mimic.restore()
        expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey')
    })

    it('should stub mutliple null collections', function() {
        localWidgets1.insert({})
        localWidgets2.insert({})
        localWidgets2.insert({})

        expect(localWidgets1.find().count()).to.equal(1)
        expect(localWidgets2.find().count()).to.equal(2)

        Mimic.shimmer(localWidgets1)
        Mimic.shimmer(localWidgets2)

        expect(localWidgets1.find().count()).to.equal(0)
        expect(localWidgets2.find().count()).to.equal(0)

        localWidgets1.insert({})
        localWidgets1.insert({})
        localWidgets2.insert({})

        expect(localWidgets1.find().count()).to.equal(2)
        expect(localWidgets2.find().count()).to.equal(1)

        Mimic.restore()

        expect(localWidgets1.find().count()).to.equal(1)
        expect(localWidgets2.find().count()).to.equal(2)

        Mimic.shimmer(localWidgets1)
        Mimic.shimmer(localWidgets2)

        localWidgets1.insert({})
        localWidgets2.insert({})
        localWidgets2.insert({})

        expect(localWidgets1.find().count()).to.equal(1)
        expect(localWidgets2.find().count()).to.equal(2)

        Mimic.restore()

        expect(localWidgets1.find().count()).to.equal(1)
        expect(localWidgets2.find().count()).to.equal(2)
    })
})
