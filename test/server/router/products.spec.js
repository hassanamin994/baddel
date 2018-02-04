const expect = require('chai').expect;
const request = require('request');
const ROOT_URL = 'http://localhost:3000/api';
const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YTc2MmE5ZjI5ODQ0MzU1NjEzNDk2MGMiLCJpYXQiOjE1MTc2OTM2MDE2NDJ9.HQk8jAFhN05lvq-PeSKGQ1JCYuVr3T_HJvTO90EcUVI';

describe('Product Routes', function() {
    it('Should return an array of products', function(done) {
        request
            .get(ROOT_URL + '/products', (err, res) => {
                expect(err).to.not.exist
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res.body)).to.be.an('array');
                done()
            });
    });
    
    it('Should add a new product', function(done) {
        let product = {title: 'Product1' , location: 'anywhere', trade_with: ['test'], category: '5a183f48f6b9b241de5540fb'}
        request({
            url: ROOT_URL + '/products',
            method: 'POST',
            json: product,
            headers: {Authorization: mockToken}
        }, (err, res) => {
            
            expect(res.statusCode).to.equal(200);
            expect(res.body._id).to.exist
            done()
        });
        
    });

    it('Should get a product by it\'s id', (done) => {
        let product = {title: 'Product1' , location: 'anywhere', trade_with: ['test'], category: '5a183f48f6b9b241de5540fb'}
        request({
            url: ROOT_URL + '/products',
            method: 'POST',
            json: product,
            headers: {Authorization: mockToken}
        }, (err, res) => {
            
            expect(res.statusCode).to.equal(200);
            expect(res.body._id).to.exist
            request({
                url: ROOT_URL + '/products/'+res.body._id,
                method: 'GET'
            }, (err, res2) => {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res2.body)._id).to.exist;
                done();
            });
        });
    });
    
    it('Should update a product by its id', done => {
        let product = {title: 'Product1' , location: 'anywhere', trade_with: ['test'], category: '5a183f48f6b9b241de5540fb'}
        request({
            url: ROOT_URL + '/products',
            method: 'POST',
            json: product,
            headers: {Authorization: mockToken}
        }, (err, res) => {
            product['title'] = 'Product2';
            request({
                url: `${ROOT_URL}/products/${res.body._id}`,
                method: 'PATCH',
                json: product,
                headers: {Authorization: mockToken}
            }, (err, res2) => {
                expect(err).not.to.exist;
                expect(res2.statusCode).to.equal(200);
                expect(res2.body.title).to.equal('Product2');
                done();
            });
        });
    });
    
});