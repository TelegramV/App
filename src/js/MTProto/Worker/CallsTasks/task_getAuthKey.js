/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


import {CallsInternal} from "../../Calls/Internal";

function task_getAuthKey({data, success, fail}) {
    try {
        success(CallsInternal.getAuthKey(data.gB, data.random, data.p))
    } catch (error) {
        fail(error)
    }
}

export default task_getAuthKey