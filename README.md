# Modpack-Searcher

Find all modpacks in Modrinth with the specifc project dependency. Like an mod or resource pack.

# How to install and use

1. First clone this project. `git clone https://github.com/lukasabbe/Modpack-Searcher.git` or download it as a [zip](https://github.com/lukasabbe/Modpack-Searcher/archive/refs/heads/main.zip) 
2. Run `npm i`
3. Than you need to configure what project you want to find. In index.js at the top you see three rows.
    ```js
    const MC_VERSIONS = ["1.21.1", "1.21.2"] // Versions you want to search for
    const MC_LOADER = 'fabric'; // Loader you want to search for
    const MOD_QUERY = 'P7dR8mSH'; // The project you want to find
    ```
    Fill them out
4. Run `node .` and than wait. It will take a while!
5. After it's done it will print out the modpacks it has found it in.