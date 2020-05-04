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
import isaac from '../../../../vendor/isaac'
export function mt_write_bytes(offset, length, input, buffer) {
    for (let i = 0; i < length; ++i) {
        buffer.setUint8(i + offset, input[i]);
    }
}

export function mt_write_uint32(offset, value, buffer) {
    buffer.setUint32(offset, value, true);
}

export function mt_get_random_num_secure(max) {
    //currently using ISAAC, not as secure as SJCL, but less size,
    //better compatibility and doesn't depend on mouse moves
    max = Math.floor(max);
    return Math.floor(isaac.random() * (max + 1));
}