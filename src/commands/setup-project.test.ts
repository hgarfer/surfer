// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { firefox } from '../engines/firefox'
import { thunderbird } from '../engines/thunderbird'
import { buildEngineChoices, buildProductChoices } from './setup-project'

describe('setup-project choices', () => {
  test('engine choices list firefox and thunderbird', () => {
    const choices = buildEngineChoices()
    expect(choices.map((c) => c.value)).toEqual(['firefox', 'thunderbird'])
  })
  test('firefox product choices keep today values and order', () => {
    const choices = buildProductChoices(firefox)
    expect(choices.map((c) => c.value)).toEqual(firefox.products)
  })
  test('thunderbird product choices reflect its products', () => {
    const choices = buildProductChoices(thunderbird)
    expect(choices.map((c) => c.value)).toEqual(thunderbird.products)
  })
})
