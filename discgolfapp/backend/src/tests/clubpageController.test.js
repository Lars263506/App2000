import request from 'supertest'
import express from 'express'
import * as clubpageController from '../controllers/clubpageController.js'
import * as clubpageService from '../services/clubpageService.js'

const app = express()
app.use(express.json())
app.get('/clubpages', clubpageController.getAllClubPages)
app.get('/clubpages/:id', clubpageController.getClubPage)
app.get('/view', clubpageController.getView)
app.post('/clubpages', clubpageController.createNewClubPage)
app.delete('/clubpages/:id', clubpageController.deleteClubPage)
app.put('/clubpages/:id', clubpageController.updateClubPage)

jest.mock('../services/clubpageService.js')

describe('Clubpage Controller', () => {
    describe('getAllClubPages', () => {
        it('should return list of all club pages', async () => {
            clubpageService.getAllClubPages.mockResolvedValue([])
            const res = await request(app).get('/clubpages')
            expect(res.status).toBe(200)
            expect(res.body.mssg).toBe('List of all club pages')
            expect(res.body.data).toEqual([])
        })

        it('should handle errors', async () => {
            clubpageService.getAllClubPages.mockRejectedValue(new Error('Error'))
            const res = await request(app).get('/clubpages')
            expect(res.status).toBe(404)
            expect(res.body.error).toBe('Error')
        })
    })

    describe('getClubPage', () => {
        it('should return a club page', async () => {
            clubpageService.getClubPage.mockResolvedValue({})
            const res = await request(app).get('/clubpages/1').set('user', { role: 'admin' })
            expect(res.status).toBe(200)
            expect(res.body.mssg).toBe('Club page found')
            expect(res.body.data).toEqual({})
        })

        it('should handle errors', async () => {
            clubpageService.getClubPage.mockRejectedValue(new Error('Error'))
            const res = await request(app).get('/clubpages/1').set('user', { role: 'admin' })
            expect(res.status).toBe(404)
            expect(res.body.error).toBe('Error')
        })
    })

    describe('getView', () => {
        it('should return member view', async () => {
            const res = await request(app).get('/view').set('user', { role: 'member' })
            expect(res.status).toBe(200)
            expect(res.body.view).toBe('member')
        })

        it('should return nonmember view', async () => {
            const res = await request(app).get('/view').set('user', { role: 'guest' })
            expect(res.status).toBe(200)
            expect(res.body.view).toBe('nonmember')
        })

        it('should handle errors', async () => {
            const res = await request(app).get('/view')
            expect(res.status).toBe(404)
            expect(res.body.error).toBe('No role found')
        })
    })

    describe('createNewClubPage', () => {
        it('should create a new club page', async () => {
            clubpageService.createNewClubPage.mockResolvedValue({})
            const res = await request(app).post('/clubpages').send({
                name: 'Test Club',
                clubOwner: 'Owner',
                description: 'Description',
                address: 'Address',
                zipCode: '12345',
                websiteURL: 'http://example.com',
                email: 'test@example.com',
                phone: '1234567890'
            })
            expect(res.status).toBe(200)
            expect(res.body.mssg).toBe('Club page has been created')
            expect(res.body.data).toEqual({})
        })

        it('should handle errors', async () => {
            clubpageService.createNewClubPage.mockRejectedValue(new Error('Error'))
            const res = await request(app).post('/clubpages').send({
                name: 'Test Club',
                clubOwner: 'Owner',
                description: 'Description',
                address: 'Address',
                zipCode: '12345',
                websiteURL: 'http://example.com',
                email: 'test@example.com',
                phone: '1234567890'
            })
            expect(res.status).toBe(500)
            expect(res.body.error).toBe('Error')
        })
    })

    describe('deleteClubPage', () => {
        it('should delete a club page', async () => {
            clubpageService.deleteClubPage.mockResolvedValue({})
            const res = await request(app).delete('/clubpages/1')
            expect(res.status).toBe(200)
            expect(res.body.mssg).toBe('Club page deleted')
            expect(res.body.data).toEqual({})
        })

        it('should handle errors', async () => {
            clubpageService.deleteClubPage.mockRejectedValue(new Error('Error'))
            const res = await request(app).delete('/clubpages/1')
            expect(res.status).toBe(404)
            expect(res.body.error).toBe('Error')
        })
    })

    describe('updateClubPage', () => {
        it('should update a club page', async () => {
            clubpageService.updateClubPage.mockResolvedValue({})
            const res = await request(app).put('/clubpages/1').send({
                name: 'Updated Club'
            })
            expect(res.status).toBe(200)
            expect(res.body.mssg).toBe('Club page has been updated')
        })

        it('should handle errors', async () => {
            clubpageService.updateClubPage.mockRejectedValue(new Error('Error'))
            const res = await request(app).put('/clubpages/1').send({
                name: 'Updated Club'
            })
            expect(res.status).toBe(500)
            expect(res.body.error).toBe('Error')
        })
    })
})
