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

import VRoute from "./VRoute"

// return VRoute to show next route, `false` to stay at previous or `404` to show 404 page error
type VRouterMiddlewareResponse = boolean | VRoute

class VRouterMiddleware {

    /**
     * @param nextRoute
     * @return {VRouterMiddlewareResponse}
     */
    process(nextRoute: VRoute): VRouterMiddlewareResponse {
        //
    }
}

export default VRouterMiddleware