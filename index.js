import { Mongo } from 'meteor/mongo'
import sinon from 'sinon'

const Mimic = (() => {
    const api = {}
    const self = this
    self.sandbox = sinon.createSandbox()
    self.colPairs = new Map()

    api.shimmer = collection => {
        if (self.colPairs.has(collection)) {
            // If we already have this collection, do nothing.
            return
        }

        const options = {
            connection: null,
            transform: collection._transform,
        }

        const shape = new Mongo.Collection(collection._name, options)

        // Manually link - add as required.
        self.sandbox.stub(collection, 'insert').callsFake(shape.insert.bind(shape))
        self.sandbox.stub(collection, 'remove').callsFake(shape.remove.bind(shape))
        self.sandbox.stub(collection, 'find').callsFake(shape.find.bind(shape))
        self.sandbox.stub(collection, 'findOne').callsFake(shape.findOne.bind(shape))

        self.colPairs.set(collection, shape)
    }

    api.restore = () => {
        // Pre-emptively remove the documents from the local collection because if
        // a collection with the same name is stubbed later it will still have the
        // documents from LocalConnectionDriver's internal cache.
        for (const localCollection of self.colPairs.values()) {
            localCollection.remove({})
        }
        self.sandbox.restore()
        self.colPairs.clear()
    }

    return api
})()

export default Mimic
