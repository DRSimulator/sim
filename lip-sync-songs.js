window.lipSyncSongs = [
    "I Will Survive by Gloria Gaynor",
    "It's Raining Men by The Weather Girls",
    "Believe by Cher",
    "Stronger by Britney Spears",
    "Born This Way by Lady Gaga",
    "Toxic by Britney Spears",
    "Physical by Dua Lipa",
    "Finally by CeCe Peniston",
    "When I Grow Up by The Pussycat Dolls",
    "So What by P!nk",
    "Fighter by Chrtistina Aguilera",
    "Break Free by Ariana Grande, Zedd",
    "Angel Of My Dreams by JADE",
    "I <3 YOU by MARINA",
    "Euphoria by Loreen",
    "Super Graphic Ultra Modern Girl by Chappell Roan",
    "Whenever, Whenever by Shakira",
    "End of the World by Miley Cyrus",
    "We Found Love by Rihanna, Calvin Harris",
    "yes, and? by Ariana Grande",
    "Tension by Kylie Mingoue",
    "Fucked by a Ghost - Spoken Word Lip Sync by Jada Shada Hudson",
    "Don't Stop Me Now by Queen",
    "Roast of Shade - Spoken Word Lip Sync by Derrick Barry",
    "Clam Chowder - Spoken Word Lip Sync by Elektra Abundance from Pose",
    "Beyonce? - Spoken Word Lip Sync by New York from Flavor of Love",
    "Talk To Me by Robyn",
    "Wannabe by Spice Girls",
    "Boss Bitch by Doja Cat",
    "Control by Janet Jackson",
    "bad idea right? by Olivia Rodrigo",
    "Viva La Vida by Coldplay",
    "GALA by XG",
    "Edge Of Seventeen by Stevie Nicks",
    "Big Guy by Ice Spice",
    "Jealous Type by Doja Cat",
    "Dancing Queen by ABBA",
    "Let Me Think About It by Ida Corr, Fedde Le Grand",
    "Ufo by cupcakKe",
    "Sans contrefaçon by Mylène Farmer",
    "Anxiety by Doechii",
    "Two of Hearts by Stacey Q",
    "How Will I Know by Whitney Houston",
    "Like A Prayer by Madonna",
    "Don't Stop Movin' by Livin' Joy",
    "it's ok i'm ok by Tate McRae",
    "Guess by Charli xcx, Billie Eilish",
    "I'll Never Love This Way Again by Dionne Warwick",
    "CHANEL by Tyla",
    "Gabriela by KATSEYE",
    "Midnight Sun by Zara Larsson",
    "What the Hell by Avril Lavigne",
    "Fergalicious by Fergie, will.i.am",
    "Your Disco Needs You by Kylie Minogue",
    "Say It Right by Nelly Furtado",
    "Nasty by Tinashe",
    "Melting by Kali Uchis",
    "Run Away With Me by Carly Rae Jepsen",
    "Salvation by Rebecca Black",
    "XS by Rina Sawayama",
    "Free Yourself by Jessie Ware"

];

window.pickRandomLipSyncSong = function () {
    if (!window.lipSyncSongs || !window.lipSyncSongs.length) return '';
    if (!Array.isArray(window._lipSyncPool) || window._lipSyncPool.length === 0) {
        const pool = [...window.lipSyncSongs];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = pool[i];
            pool[i] = pool[j];
            pool[j] = temp;
        }
        window._lipSyncPool = pool;
    }
    return window._lipSyncPool.pop() || '';
};
