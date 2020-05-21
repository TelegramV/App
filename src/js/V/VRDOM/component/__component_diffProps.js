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

import __diffObjects from "./__diffObjects";
import __component_withDefaultProps from "./__component_withDefaultProps";

const comparator = (prev, next) => typeof prev === "object" || prev !== next;

const __component_diffProps = (component, nextProps) => {
    nextProps = __component_withDefaultProps(component, nextProps);
    return __diffObjects(component.props, nextProps, comparator);
}

export default __component_diffProps