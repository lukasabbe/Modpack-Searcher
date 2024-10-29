const fetch = require('node-fetch');

const MC_VERSIONS = ["1.21.1", "1.21.2"] // Versions you want to search for
const MC_LOADER = 'fabric'; // Loader you want to search for
const MOD_QUERY = 'P7dR8mSH'; // The project you want to find
const DEBUG = false; //prints out when found a modpack with the mod

const NODE_FETCH_OPTIONS = {
    method : 'GET',
    headers: {
        'User-Agent': 'lukasabbe/Modpack-Searcher/1.0.0'
    }
}

var requests_per_sec = 0;
var last_request = Date.now();
var mc_versions_string;
var mc_versions_string2;

(async ()=>{
    let projects;
    let offset = 0;
    const foundModpacks = [];
    mc_versions_string = `"versions:${MC_VERSIONS.join('","versions:')}"`;
    mc_versions_string2 = `${MC_VERSIONS.join('","')}`;
    console.log("Searching for modpacks with mod: ", MOD_QUERY);
    do{
        projects = await search(offset);
        for(const project of projects.hits){
            console.log("Checking project: ", project.title);
            const versions = await getVersions(project.project_id);
            let found = false;
            for(const version of versions){
                for(const dependency of version.dependencies){
                    if(dependency.project_id === MOD_QUERY && !found){
                        foundModpacks.push(project.slug);
                        found = true;
                        if(DEBUG)
                            console.log(`Found ${project.title} with version ${version.id}`);
                    }
                }
            }
        }
        offset++;
        console.log("Offset: ", offset*100);
    }while(projects.hits.length > 0);
    console.log("Found modpacks: ");
    for(const modpack of foundModpacks){
        console.log("https://modrinth.com/modpack/"+modpack);
    }
})()

async function search(offset){
    await rateLimiterChecker();
    return new Promise((resolve, reject)=>{
        fetch(`https://api.modrinth.com/v2/search?facets=[[${mc_versions_string}],["categories:${MC_LOADER}"],["project_type:modpack"]]&limit=100&offset=${offset*100}`,NODE_FETCH_OPTIONS)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
}
async function getVersions(id){
    await rateLimiterChecker();
    return new Promise((resolve, reject)=>{
        fetch(`https://api.modrinth.com/v2/project/${id}/version?game_versions=["${mc_versions_string2}"]&loaders=["${MC_LOADER}"]`,NODE_FETCH_OPTIONS)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
}

async function rateLimiterChecker(){
    if(requests_per_sec > 5 && Date.now() - last_request < 1000){
        console.log("Rate limit reached, waiting 200ms");
        requests_per_sec = 0;
        await wait(200);
    }else if (Date.now() - last_request >= 1000){
        requests_per_sec = 0;
    }
    requests_per_sec++;
    last_request = Date.now();
}

function wait(ms){
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, ms);
    })
}