/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

export const ALIGNMENT = {
    AUTO: 'auto',
    START: 'start',
    CENTER: 'center',
    END: 'end',
}

export const DIRECTION = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
}

export const SCROLL_CHANGE_REASON = {
    OBSERVED: 'observed',
    REQUESTED: 'requested',
}

export const scrollProp = {
    [DIRECTION.VERTICAL]: 'scrollTop',
    [DIRECTION.HORIZONTAL]: 'scrollLeft',
};

export const sizeProp = {
    [DIRECTION.VERTICAL]: 'height',
    [DIRECTION.HORIZONTAL]: 'width',
};

export const positionProp = {
    [DIRECTION.VERTICAL]: 'top',
    [DIRECTION.HORIZONTAL]: 'left',
};

export const marginProp = {
    [DIRECTION.VERTICAL]: 'marginTop',
    [DIRECTION.HORIZONTAL]: 'marginLeft',
};

export const oppositeMarginProp = {
    [DIRECTION.VERTICAL]: 'marginBottom',
    [DIRECTION.HORIZONTAL]: 'marginRight',
};
