const fs = require("fs");
const path = require("path");
const request = require("request-promise");
const cheerio = require("cheerio");

let Scraper = {
  getWallLinks: async (links, resolution, folder, startPage, endPage) => {
    if (!fs.existsSync(`./${folder}`)) {
      fs.mkdirSync(`./${folder}`);
    }
    let downloadAbleLinks = [];
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      let html = await request.get(
        `https://hdqwalls.com/1920x1080-resolution-wallpapers/page/${pageNum}`
      );

      let $ = await cheerio.load(html);
      // let links = [];
      // console.log(html)
      $("img.thumbnail").each((index, element) => {
        downloadAbleLinks[index] = $(element).attr("src");
      });

      //   $(".caption.hidden-md").each((index, element) => {
      //     links[index] = `${url}${$(element).attr("href")}.jpg`;
      //   });

      //   console.log(links);
      // URL must be look like                               **https://images.hdqwalls.com/download/2020-batman-beyond-4k-mv-1920x1080.jpg**
      await downloadAbleLinks.forEach((link, index) => {
        downloadAbleLinks[index] = `https://images.hdqwalls.com/download/${
          path.basename(link).split(".")[0]
        }-${resolution}.${path.basename(link).split(".")[1]}`;
      });
      // console.log(...links ,...downloadAbleLinks); 
      links = await [...links, ...downloadAbleLinks];
      // links = [...downloadAbleLinks];
      // console.log(downloadAbleLinks);
      
    }
    return links;
  },

  download: async (link, folder) => {
    //   console.log(path.basename(link).split("."));
    let imageStream = await fs.createWriteStream(`./${folder}/${path.basename(link)}`);
   await  request.get(link, (err, res, body) => {
       request(link)
        .pipe(imageStream)
        .on("close", () => {
          console.log(`${path.basename(link).split(".")[0]} Downloaded!!!`);
        });
    });
  },

  main: async (resolution, folder,startPage, endPage = 1) => {
    console.log(
      "*******************hqwalls.com Wallpaper Scraper and Downloader by MD Zaid*******************"
    );
    let links = [];
    links = await Scraper.getWallLinks(links, resolution, folder, startPage, endPage);
    console.log(await links);
    //   console.log(links);
    for (let i = 0; i < links.length; i++) {
      await Scraper.download(links[i],folder);
    }
  },
};

// Scraper.main("1920x1080","desktop" ,1);
Scraper.main("1080x2280","mobile" ,1);
















// let getWallLinks = async (links, resolution) => {
//   if (!fs.existsSync("./images")) {
//     fs.mkdirSync("./images");
//   }
//   let html = await request.get(
//     "https://hdqwalls.com/1920x1080/4k-wallpapers"
//   );

//   let $ = await cheerio.load(html);
//   // let links = [];
//   // console.log(html)
//   $("img.thumbnail").each((index, element) => {
//     links[index] = $(element).attr("src");
//   });

//   //   $(".caption.hidden-md").each((index, element) => {
//   //     links[index] = `${url}${$(element).attr("href")}.jpg`;
//   //   });

//   //   console.log(links);
//   // URL must be look like it                               **https://images.hdqwalls.com/download/2020-batman-beyond-4k-mv-1920x1080.jpg**
//   links.forEach((link, index) => {
//     links[index] = `https://images.hdqwalls.com/download/${
//       path.basename(link).split(".")[0]
//     }-${resolution}.${path.basename(link).split(".")[1]}`;
//   });
// };

// let download = (link) => {
//   //   console.log(path.basename(link).split("."));
//   let imageStream = fs.createWriteStream(`./images/${path.basename(link)}`);
//   request.get(link, (err, res, body) => {
//     request(link)
//       .pipe(imageStream)
//       .on("close", () => {
//         console.log(`${path.basename(link).split(".")[0]} Downloaded!!!`);
//       });
//   });
// };

// let main = async (resolution) => {
//   console.log("*******************hqwalls.com Wallpaper Scraper and Downloader by MD Zaid*******************");
//   let links = [];
//   await getWallLinks(links, resolution);
//   //   console.log(links);
//   for (let i = 0; i < links.length; i++) {
//     await download(links[i]);
//   }
// };

// main("1920x1080");
