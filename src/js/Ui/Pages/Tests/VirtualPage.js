// /*
//  * Copyright 2020 Telegram V authors.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  */
//
// import CountryDropdownItemFragment from "../../Components/Login/CountryDropdownItemFragment"
// import SimpleVirtualList from "../../../V/VRDOM/list/SimpleVirtualList"
// import {countries} from "../../Utils/utils"
// import "./Virtual.scss"
// import HardVirtualList from "../../../V/VRDOM/list/HardVirtualList"
// import Random from "../../../MTProto/Utils/Random"
//
// const flags = []
//
// for (let i = 0; i < 10; i++) {
//     flags.push(...countries.map(l => {
//         return {
//             flag: l[3],
//             name: l[1],
//             code: l[0]
//         }
//     }))
// }
//
// const numbers = new Array(1000000).fill(null).map((value, index) => index)
//
// function VirtualPage() {
//
//     return (
//         <div>
//             {flags.length} flags
//             <SimpleVirtualList items={flags}
//                                containerHeight={200}
//                                itemHeight={50}
//                                template={CountryDropdownItemFragment}/>
//             <hr/>
//             <HardVirtualList items={flags}
//                              containerHeight={200}
//                              template={CountryDropdownItemFragment}/>
//             {numbers.length} numbers
//             <hr/>
//             <HardVirtualList items={numbers}
//                              containerHeight={300}
//                              template={(i) => <div style={{
//                                  height: `${Random.nextInteger(100) + 20}px`,
//                                  display: "flex",
//                                  border: "1px solid #ccc"
//                              }}>item {i}</div>}/>
//         </div>
//     )
// }
//
// export default VirtualPage