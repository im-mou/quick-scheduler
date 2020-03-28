/*\
|*|
|*|	:: MiniDaemon ::
|*|
|*|	Revision #2 - September 26, 2014
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/window.setInterval
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/minidaemon.js
|*|
|*|	This framework is released under the GNU Lesser General Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/lgpl-3.0.html
|*|
\*/
export default class MiniDaemon {
    constructor(oOwner, fTask, nRate, nLen) {

        if (!(this && this instanceof MiniDaemon)) {
            return;
        }
        if (arguments.length < 2) {
            throw new TypeError('MiniDaemon - not enough arguments');
        }
        
        this.owner = null;
        this.task = null;
        this.rate = 100; // 1s default
        this.length = Infinity;

        /* These properties should be read-only */

        this.SESSION = -1;
        this.INDEX = 0;
        this.PAUSED = true;
        this.BACKW = true;

        if (oOwner) {
            this.owner = oOwner;
        }
        this.task = fTask;
        if (isFinite(nRate) && nRate > 0) {
            this.rate = Math.floor(nRate);
        }
        if (nLen > 0) {
            this.length = Math.floor(nLen);
        }

    }
    /* Instances methods */
    isAtEnd() {
        return this.BACKW
            ? isFinite(this.length) && this.INDEX < 1
            : this.INDEX + 1 > this.length;
    }
    synchronize() {
        if (this.PAUSED) {
            return;
        }
        clearInterval(this.SESSION);
        this.SESSION = setInterval(this.forceCall, this.rate, this);
    }
    pause() {
        clearInterval(this.SESSION);
        this.PAUSED = true;
    }
    start(bReverse) {
        var bBackw = Boolean(bReverse);
        if (this.BACKW === bBackw && (this.isAtEnd() || !this.PAUSED)) {
            return;
        }
        this.BACKW = bBackw;
        this.PAUSED = false;
        this.synchronize();
    }
    /* Global methods */
    static forceCall(oDmn) {
        oDmn.INDEX += oDmn.BACKW ? -1 : 1;
        if (oDmn.task.call(oDmn.owner, oDmn.INDEX, oDmn.length, oDmn.BACKW) ===
            false ||
            oDmn.isAtEnd()) {
            oDmn.pause();
            return false;
        }
        return true;
    }
}
