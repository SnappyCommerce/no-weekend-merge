import {isInDowntime, getUTCAdjustments} from '../src/check'

describe('isInDowntime should', () => {
  const currentDate = new Date(Date.UTC(2021, 1, 13, 12, 53))
  const utcAdjustments = getUTCAdjustments(3.5)

  test('return false when no downtime is provided', () => {
    expect(isInDowntime(currentDate, utcAdjustments)).toBe(false)
  })

  test('throw error when downtime does not match pattern', () => {
    expect(() =>
      isInDowntime(currentDate, utcAdjustments, '6:00-7:00')
    ).toThrow('Invalid downtime')
  })

  test('throw error when downtime is not valid time', () => {
    expect(() =>
      isInDowntime(currentDate, utcAdjustments, '17:00-24:00')
    ).toThrow('Invalid downtime')
  })

  test('throw error when downtime start time is after end time', () => {
    expect(() =>
      isInDowntime(currentDate, utcAdjustments, '16:30-07:00')
    ).toThrow('Invalid downtime')
  })

  test('return true when in downtime', () => {
    expect(isInDowntime(currentDate, utcAdjustments, '16:00-23:59')).toBe(true)
  })

  test('return false when not in downtime', () => {
    expect(isInDowntime(currentDate, utcAdjustments, '16:30-23:59')).toBe(false)
  })
})

describe('isInDowntime should (UTC -3)', () => {
  const utcAdjustments = getUTCAdjustments(-3)
  const downtimeString = '00:00-07:00,19:00-23:59';

	test('Should not be in downtime', () => {
		const currentDate = new Date(Date.UTC(2024, 8, 11, 44, 3))
		expect(isInDowntime(currentDate, utcAdjustments, downtimeString)).toBe(false)
	})
	
	test('Should be in downtime', () => {
		const currentDate = new Date(Date.UTC(2024, 8, 9, 44, 3))
		expect(isInDowntime(currentDate, utcAdjustments, downtimeString)).toBe(false)
	})
})
