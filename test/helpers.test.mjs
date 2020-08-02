import {getDateStringForDeletion, getMessage} from '../src/utils/helpers.mjs'

describe('getDateStringForDeletion', () => {
    test('no change', () => {
        // months are 0-indexed, days are 1-indexed
        const date = new Date(Date.UTC(2020, 0, 1))
        expect(getDateStringForDeletion(date, 0)).toBe('2020-01-01')
    })
    test('within month', () => {
        const date = new Date(Date.UTC(2020, 0, 8))
        expect(getDateStringForDeletion(date, 7)).toBe('2020-01-01')
    })
    test('change month', () => {
        const date = new Date(Date.UTC(2020, 1, 1))
        expect(getDateStringForDeletion(date, 1)).toBe('2020-01-31')
    })
    test('change year', () => {
        const date = new Date(Date.UTC(2020, 0, 1))
        expect(getDateStringForDeletion(date, 1)).toBe('2019-12-31')
    })
})

describe('getMessage', () => {
    test('parsing event details', () => {
        const event = {
            name: 'repo',
            url: 'https://github.com/org/repo/pull/1234',
            number: '1234',
            author: 'username',
        }
        expect(getMessage(event)).toBe(
            '<https://github.com/org/repo/pull/1234|repo #1234> (by username) has just been merged.',
        )
    })
})
