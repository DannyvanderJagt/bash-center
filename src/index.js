import uid from 'uid';
import {exec} from 'child_process';
import Process from './process';
import Command from './command';
import util from 'util';

/**
 * Bash Center.
 * @namespace bashcenter
 */
let BashCenter = {
    /**
     * @var {Object} _processes - All the running processes.
     */
    _processes: {},
    
    /**
     * Get a list of all the processes.
     * @name list
     * @return {Object} A list of all the processes.
     */
    list(){
        return this._processes;
    },
    
    /**
     * Create a new process.
     * @param  {Object} settings - The settings for the new process.
     * @return {Object} Project
     */
    process(settings){
        let pr = new Process(settings);
        this._processes[pr.id] = pr; 
        return pr;
    },
    
    /**
     * Kill all the current processes.
     * @param {Boolean} detached - Kill all the detached process too.
     */
    killAll(detached = true){
        for(let id in this._processes){
            if(!detached && (this._processes[id].settings && this._processes[id].settings.detached === true)){
                return;
            }
            this._processes[id].kill();
        }
    },
    
    /**
     * Execute a command.
     * @param  {String}   command  - The command
     * @param  {Function} callback - The callback.
     */
    exec(command, callback){
        command = new Command(command);
        if(util.isFunction(callback)){
            command.addCallback(callback);
        }

        let p = exec(command.executingLine, (error, stderr, stdout) => {
            if(error){
                command.addError(error);
            }
            if(stderr){
                stderr = stderr.toString().split(/\n/g);
                stderr.forEach((line) => {
                    command.addToResult(line);
                });
            }
            if(stdout){
                stdout = stdout.toString().split(/\n/g);
                stdout.forEach((line) => {
                    command.addToResult(line);
                });
            }
        });
    }
};

export default BashCenter;

/* 
    Kill all the process (except the detached ones) when the node process exists
    to prevent useless running processes.
*/
process.on('exit', function(code) {
    BashCenter.killAll(false);
});

process.on('SIGINT', function() {
  process.exit();
});
