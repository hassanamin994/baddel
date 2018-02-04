const expect = require('chai').expect;
const request = require('request');
const ROOT_URL = 'http://localhost:3000/api';
const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YTc2MmE5ZjI5ODQ0MzU1NjEzNDk2MGMiLCJpYXQiOjE1MTc2OTM2MDE2NDJ9.HQk8jAFhN05lvq-PeSKGQ1JCYuVr3T_HJvTO90EcUVI';



describe('Categories Route', () => {
    let createdCategories = [];

    it('Should get an array of categories', done => {
        request(`${ROOT_URL}/categories`, (err, res) => {
            expect(err).not.to.exist;
            expect(res.statusCode).to.equal(200);
            expect(JSON.parse(res.body)).to.be.an('array');
            done();
        })
    });

    it('Should create a category', done => {
        let category = {name: 'cat', icon: 'product'};
        request({
            url: ROOT_URL + '/categories',
            method: 'POST',
            json: category
        }, (err, res) => {
            expect(err).not.to.exist;
            expect(res.statusCode).to.equal(200);
            expect(res.body.name).to.equal(category.name);
            if(res.body._id)
                createdCategories.push(res.body._id);
            done();
        });
    });

    it('Should delete a category by its id', done => {
        let category = {name: 'cat'};
        request({
            url: ROOT_URL + '/categories',
            method: 'POST',
            json: category
        }, (err, res) => {
            request({
                url: ROOT_URL + '/categories/'+res.body._id,
                method: 'DELETE',
            }, (err, res) => {
                expect(err).not.to.exist;
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res.body).success).to.be.true;
                done();
            });
        });
    });

    after(() => {
        createdCategories.forEach(id => {
            console.log(id)
        })
    })
})