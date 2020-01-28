import {createLogger} from "../logger"

let Storage = {
    authorizationData: {
        "_": "auth.authorization",
        "pFlags": {},
        "flags": 0,
        "user": {
            "_": "user",
            "pFlags": {"self": true, "contact": true, "mutual_contact": true},
            "flags": 7259,
            "id": 374355715,
            "access_hash": "12504812821303420375",
            "first_name": "Давид",
            "username": "kohutd",
            "phone": "380633905791",
            "status": {"_": "userStatusOffline", "was_online": 1579619921}
        }
    },
    authKey5: "1fef45dc65c319545a16e6dbafe9e76eacf38b0cc02e17d2736e5499b982c01bc327dd62800fcd19c77b0ab6a4da51346085967eda1fb780c5c098e5098417f8ab3806367bf44852358b603131b0b38994d9465d33d72a206ea5f09c37c0ad647ed3d4fa781782531c75ab2de6988d050595bf72335e6057f752a393b8d339fb90fe148dec632e512d99f4934f10d22a5f89c8b188de2b207192f090489fafd4a40dbcf4c6161751f652c61d0c2e377865d0f47b302245adb0421a9b2af94f34e391c82a3528a01516616fb4820ac244cca0712dbfa502b100639a6477000c1cb0e7b02bc94244aedd38ffe649e1fdf632ff90691b591809bcb268c8c49bd10d",
    serverSalt5: "7da39dcf8cf057c3",
    authKey1: "c4ad17811b022d154e636cd32f74d25ad3c9aa4c896114b9f768735800129135cb00b79bb4264d512b9096f07574bcf99fc266c818f8367c6931be5135432aaedcec4ab0a5ddf0acdc7ba7cf225f11bd791c8f30d7b849502d5d41bc4258962dc0874efa92916b9e31bd2d732ffe0094208075477248cfd5c054258bff9fbf8d122c4bea50d0d7922d3b2b3020694a4f6a5db64e75a088c3cf79eafdf6384710decd8ea6a1ec35a8dca837fc512d654e6ddafa355d966765f45fc84e0912d6cb4c449e2533ee82203a3907b40d2b15ef68febdc9d80b9e239ca214709a90e9cde76d3641add2e1e6a3fe0796e63651ee82d478f03bf8eeb16c4c7e7c01c0944f",
    serverSalt1: "557f56874a5f8c76",
    serverSalt2: "f14a5dfad14e3a96",
    serverSalt4: "5de8a45a0bf2c63e",
    authKey2: "70e20c157dfd1c5a6bbef214bdb7a4ef0f7aaf772f437f9fb2df16451bb4942768bf381d15e6f341ea0b227f3175694996652bb56e18b08655764d14c504cac55c983864fd29947a685a303e2676f69448d1effa58d4f40ec9aeddae6c8f651339a60f4aa78822175b18b409caa70da6159164cddacdb24e9a5395f39943627ade891527574308d4bb5a4f5dea4d68a305ab3b2beda011250594600bbfcf94afb3080361fd96eda5d82371759389aa561a2baceb47076c890286eaa95b32d3ca4eb75f6bb65268d5294d7ca73fe90d6422e135cee42feb22f0b37608e7409ab845e62b2cc45db775e5138dc6ed29aa79f26590dbec590043e3b8a11427ee3bb2",
    authKey4: "7e850d6725304797b8584aad55da3b616aaa61cc8bc4e619a9cb9cbe99471a53bcbc162b06bba0f08f3469447eca0c7a93e4d781fe4dedbfabc970f346c2dfb0077d9dffead06d239965cab39c27da84e96565aaf9d14f657a562eb0f15d7c3259a8b67c348038c92136d2ed317a6fc874be12c375191399f970bad1e463ce08edad9e3e6cdbba5ff4e09ec028ce5f0fe6b57bd7327615bd6edff0e75697f9d46f45abd8b36fa6afb73ab5a1ed5c77a1439f4560788c6e8a5d2a7327a07e4014ee0ea66e2d6d70ee1053568071c961bdb4ecbab2736b6b157681d590abd0896ab20f281035d82d29b2fcaa79cc9df55a7dbd491de619b8b78ba599fd0bd1240b"
}

const Logger = createLogger("PermanentStorage", {
    level: "log"
})

class CustomDriver {
    getItem(key) {
        return Storage[key]
    }

    setItem(key, value) {
        Storage[key] = value
    }

    removeItem(key) {
        delete Storage[key]
    }

    exist(key) {
        return Storage[key]
    }

    clear() {
        Storage = {}
    }
}

/**
 * Data stored in this storage has no expiration time.
 *
 * TODO: mb we should make all methods async..
 *
 * The `driver` must implement following methods:
 * - `getItem(key)`
 * - `setItem(key, value)
 * - `removeItem(key, value)
 * - `exists(key)`
 * - `clear()`
 */
export class PermanentStorage {
    constructor(options = {
        driver: new CustomDriver(),
    }) {
        this.driver = options.driver || new CustomDriver()
    }

    getItem(key, defaultValue = undefined) {
        if (this.exists(key)) {
            let value = null
            value = this.driver.getItem(key)
            Logger.debug(`read [${key}]`, value)
            return value
        } else {
            if (typeof defaultValue !== "undefined") {
                return defaultValue
            } else {
                throw new Error(`${key} was not found`)
            }
        }
    }

    setItem(key, value) {
        let setValue = null
        setValue = value
        this.driver.setItem(key, setValue)
        Logger.debug(`set [${key}]`, value)
        return setValue
    }

    removeItem(key) {
        this.driver.removeItem(key)
        Logger.debug(`removed [${key}]`)
    }

    exists(key) {
        return !(!this.driver.getItem(key))
    }

    clear() {
        Logger.debug(`cleared`)
        this.driver.clear()
    }
}
