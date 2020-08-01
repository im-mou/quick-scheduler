const upgrade = version => {

    let uptodate = false;

    // check if version element is set
    let curr_ver = JSON.parse(localStorage.version);
    //uptodate = (curr_ver !== '' && curr_ver && curr_ver[0] === version);

    if(curr_ver === undefined || curr_ver === '') {
        localStorage.version = JSON.stringify([version])
        uptodate = true;
    } else {
        uptodate = false;
    }

    // stop if app is uptodate
    if(uptodate) return;

}