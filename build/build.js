/* eslint-disable no-console */
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, basename } from "node:path";
import { argv } from "node:process";
import { reporter } from "vfile-reporter";
import { remark } from "remark";
import remarkCodeTitles from "./remark-code-titles.js";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import remarkHeadings from "./remark-headings.js";
import remarkPresetLintMarkdownStyleGuide from "remark-preset-lint-markdown-style-guide";
import remarkRehype from "remark-rehype";
import remarkReferenceLinks from "./remark-reference-links.js";
import remarkTableOfContents from "./remark-table-of-contents.js";
import remarkTorchLight from "remark-torchlight";
import remarkValidateLinks from "remark-validate-links";
import rehypeStringify from "rehype-stringify";


dotenv.config();

const build = async (filename) => {
  const md = readFileSync(filename, "utf-8");
  const html = await remark()
    .use(remarkPresetLintMarkdownStyleGuide)
    .use(remarkGfm)
    .use(remarkHeadingId)
    .use(remarkHeadings, {
      startDepth: 2,
      skip: [
        "Abstract",
        "Status",
        "Note to Readers",
        "Table of Contents",
        "Authors' Addresses",
        "Champions",
        "\\[.*\\]",
        "draft-.*"
      ]
    })
    .use(remarkReferenceLinks)
    .use(remarkFlexibleContainers)
    .use(remarkCodeTitles)
    .use(remarkTorchLight)
    .use(remarkTableOfContents, {
      startDepth: 2,
      skip: [
        "Abstract",
        "Note to Readers",
        "Authors' Addresses",
        "Champions",
        "\\[.*\\]",
        "draft-.*"
      ]
    })
    .use(remarkValidateLinks)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);

  const outfile = `${dirname(filename)}/${basename(filename, ".md")}.html`;
  writeFileSync(outfile, `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">

    <style>
      svg {
        fill: currentColor;
      }

      /* Torchlight */
      pre {
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 0;
      }

      pre.torchlight code {
        display: block;
        min-width: -webkit-max-content;
        min-width: -moz-max-content;
        min-width: max-content;
        border-radius: 0.5rem;
      }

      pre.torchlight code .line {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      pre.torchlight code .line-number,
      pre.torchlight code .summary-caret {
        margin-right: 1rem;
      }

      /* Flexible Code Titles */
      .remark-code-container{
        border-radius: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      .remark-code-title {
        height: 1.25rem;
        border-radius: 0.5rem 0.5rem 0 0;
        position: relative;
        top: 0.5rem;
        background-color: var(--background-alt);
        padding: 0.5rem 0.5rem 0.5rem 2.5rem;
        background-repeat: no-repeat;
        background-size: 1.25rem;
        background-position-y: center;
        background-position-x: 0.75rem;
      }

      .code-title-unknown {
        padding-left: 1rem;
      }

      .code-title-jsonschema {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 70.423268 70.42326'%3E%3Cg transform='translate(-104.22785,-45.507923)' id='layer1' fill='%23ffffff'%3E%3Cpath id='path4544' d='m 122.99401,114.18985 c -4.32897,-0.9404 -7.58044,-3.47848 -8.71251,-6.80095 -0.78921,-2.31618 -0.67682,-6.07238 0.33363,-11.150598 0.48507,-2.437836 0.88169,-5.347843 0.88139,-6.466688 -9.8e-4,-3.718098 -1.71106,-5.735418 -5.1001,-6.016462 l -1.9549,-0.162116 v -2.392655 -2.392657 l 1.85208,-0.250855 c 2.70243,-0.366031 3.74441,-1.02838 4.57629,-2.908984 0.61121,-1.381726 0.68884,-2.068648 0.50552,-4.472869 -0.11913,-1.562244 -0.53527,-4.348568 -0.92477,-6.191832 -0.98954,-4.682868 -0.94822,-8.485471 0.11707,-10.773163 1.56862,-3.368589 5.43705,-5.854553 9.93248,-6.382903 l 1.93299,-0.227185 v 2.518015 2.518015 h -1.29973 c -1.77186,0 -4.2497,1.262413 -4.8835,2.488054 -0.60797,1.175674 -0.65405,2.864146 -0.15834,5.802223 0.78343,4.643508 1.04707,9.098344 0.67592,11.421636 -0.42464,2.658142 -1.97477,5.796328 -3.6791,7.448236 l -1.18012,1.143813 1.61497,1.982752 c 1.99051,2.443801 2.76458,4.148744 3.24284,7.142561 0.37835,2.368341 0.0844,7.282673 -0.67072,11.213982 -1.05359,5.48514 0.1623,7.65141 4.66209,8.30613 l 1.67569,0.24382 v 2.44782 c 0,2.79211 0.17086,2.69708 -3.43917,1.91286 z' style='fill:stroke-width:0.35277775'/%3E%3Cpath id='path4546' d='m 152.2304,112.24932 v -2.42987 l 2.04969,-0.42336 c 2.26276,-0.46736 4.054,-1.8634 4.45842,-3.47475 0.1274,-0.50758 -0.11267,-3.16398 -0.53347,-5.90311 -1.37183,-8.929552 -0.6114,-13.537042 2.85482,-17.297452 l 1.48237,-1.60818 -1.1108,-1.26512 c -3.97855,-4.53132 -4.66885,-8.552208 -3.15364,-18.369547 0.76342,-4.946305 0.76409,-4.994322 0.087,-6.173611 -0.79713,-1.388278 -3.28385,-2.776033 -4.97438,-2.776033 h -1.15997 v -2.469445 c 0,-2.811057 -0.0583,-2.773846 3.24583,-2.072788 3.9645,0.841179 6.80448,2.853272 8.27787,5.864775 0.84544,1.728026 0.97275,2.400136 0.94911,5.010889 -0.015,1.658349 -0.35758,4.682054 -0.76125,6.719346 -1.49867,7.563594 -1.3651,9.576204 0.7654,11.532814 0.98915,0.90842 1.64012,1.17274 3.37032,1.36849 l 2.14439,0.24261 v 2.42387 2.42388 l -1.6757,7.1e-4 c -2.1517,7e-4 -3.9323,0.90924 -4.83869,2.46889 -0.95194,1.63803 -0.89239,5.20675 0.17364,10.40695 0.90648,4.421902 1.05253,8.458452 0.3882,10.728752 -0.70059,2.39406 -3.81995,5.29609 -6.74745,6.27718 -1.26118,0.42266 -2.96775,0.87096 -3.79236,0.99623 l -1.49931,0.22775 z' style='stroke-width:0.35277778'/%3E%3Cpath id='path4548' d='m 131.74239,108.26592 c -1.02163,-1.2988 -0.87294,-3.53652 0.38087,-5.73185 0.92776,-1.62446 4.80862,-6.948549 7.61066,-10.440949 l 1.13094,-1.40958 -1.80213,-5.22523 c -2.02147,-5.86123 -2.0098,-5.97467 0.65581,-6.37225 l 1.46834,-0.219 1.64076,3.3506 c 0.90242,1.84283 1.76982,3.35061 1.92755,3.35061 0.15774,0 1.77489,-1.75542 3.59368,-3.90092 3.15918,-3.72667 3.35688,-3.89165 4.42591,-3.69334 0.64552,0.11974 1.21858,0.0465 1.35432,-0.17316 0.31818,-0.51481 1.23083,0.24704 1.23083,1.02746 0,0.32009 -0.45438,1.13409 -1.00972,1.80888 -2.26771,2.75549 -7.10417,9.27155 -7.10417,9.5713 0,0.17685 0.97502,2.45302 2.16671,5.05816 l 2.1667,4.736609 -0.65823,0.98459 c -0.36203,0.54152 -0.66236,1.12603 -0.6674,1.29891 -0.005,0.17288 -0.27769,0.48371 -0.60588,0.69073 -0.83174,0.52464 -1.44656,-0.11541 -3.9894,-4.153119 -1.16417,-1.84856 -2.23163,-3.36491 -2.37215,-3.36967 -0.31309,-0.0106 -3.7911,5.131969 -6.47955,9.580639 -2.37093,3.92324 -1.93885,3.4204 -3.26614,3.80106 -0.95533,0.27398 -1.19348,0.19843 -1.79831,-0.57048 z' style='stroke-width:0.35277775'/%3E%3Cpath id='path4550' d='m 131.98567,83.677091 c -2.15148,-3.8472 -6.0183,-9.42829 -7.57842,-10.93815 -0.79252,-0.76698 -1.44094,-1.57494 -1.44094,-1.79546 0,-0.6016 1.61695,-1.21975 3.19058,-1.21975 1.69822,0 3.49597,1.47777 5.0997,4.19203 0.58208,0.98515 1.15641,1.79434 1.27629,1.79819 0.11988,0.004 0.80873,-1.65116 1.53078,-3.67779 1.5464,-4.34039 5.62351,-12.777999 7.22453,-14.951229 1.3726,-1.86316 3.42936,-2.865165 5.90274,-2.875676 3.23375,-0.01374 3.24268,0.130067 0.20474,3.296663 -4.63599,4.832327 -6.76321,8.809632 -11.25155,21.037252 -1.24637,3.39549 -2.39032,6.47895 -2.54212,6.85214 -0.23022,0.56597 -0.49833,0.28096 -1.61633,-1.71822 z' style='stroke-width:0.35277775'/%3E%3C/g%3E%3C/svg%3E");
      }

      .code-title-json {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 70.423268 70.42326'%3E%3Cg transform='translate(-104.22785,-45.507923)' id='layer1' fill='%23ffffff'%3E%3Cpath id='path4544' d='m 122.99401,114.18985 c -4.32897,-0.9404 -7.58044,-3.47848 -8.71251,-6.80095 -0.78921,-2.31618 -0.67682,-6.07238 0.33363,-11.150598 0.48507,-2.437836 0.88169,-5.347843 0.88139,-6.466688 -9.8e-4,-3.718098 -1.71106,-5.735418 -5.1001,-6.016462 l -1.9549,-0.162116 v -2.392655 -2.392657 l 1.85208,-0.250855 c 2.70243,-0.366031 3.74441,-1.02838 4.57629,-2.908984 0.61121,-1.381726 0.68884,-2.068648 0.50552,-4.472869 -0.11913,-1.562244 -0.53527,-4.348568 -0.92477,-6.191832 -0.98954,-4.682868 -0.94822,-8.485471 0.11707,-10.773163 1.56862,-3.368589 5.43705,-5.854553 9.93248,-6.382903 l 1.93299,-0.227185 v 2.518015 2.518015 h -1.29973 c -1.77186,0 -4.2497,1.262413 -4.8835,2.488054 -0.60797,1.175674 -0.65405,2.864146 -0.15834,5.802223 0.78343,4.643508 1.04707,9.098344 0.67592,11.421636 -0.42464,2.658142 -1.97477,5.796328 -3.6791,7.448236 l -1.18012,1.143813 1.61497,1.982752 c 1.99051,2.443801 2.76458,4.148744 3.24284,7.142561 0.37835,2.368341 0.0844,7.282673 -0.67072,11.213982 -1.05359,5.48514 0.1623,7.65141 4.66209,8.30613 l 1.67569,0.24382 v 2.44782 c 0,2.79211 0.17086,2.69708 -3.43917,1.91286 z' style='fill:stroke-width:0.35277775'/%3E%3Cpath id='path4546' d='m 152.2304,112.24932 v -2.42987 l 2.04969,-0.42336 c 2.26276,-0.46736 4.054,-1.8634 4.45842,-3.47475 0.1274,-0.50758 -0.11267,-3.16398 -0.53347,-5.90311 -1.37183,-8.929552 -0.6114,-13.537042 2.85482,-17.297452 l 1.48237,-1.60818 -1.1108,-1.26512 c -3.97855,-4.53132 -4.66885,-8.552208 -3.15364,-18.369547 0.76342,-4.946305 0.76409,-4.994322 0.087,-6.173611 -0.79713,-1.388278 -3.28385,-2.776033 -4.97438,-2.776033 h -1.15997 v -2.469445 c 0,-2.811057 -0.0583,-2.773846 3.24583,-2.072788 3.9645,0.841179 6.80448,2.853272 8.27787,5.864775 0.84544,1.728026 0.97275,2.400136 0.94911,5.010889 -0.015,1.658349 -0.35758,4.682054 -0.76125,6.719346 -1.49867,7.563594 -1.3651,9.576204 0.7654,11.532814 0.98915,0.90842 1.64012,1.17274 3.37032,1.36849 l 2.14439,0.24261 v 2.42387 2.42388 l -1.6757,7.1e-4 c -2.1517,7e-4 -3.9323,0.90924 -4.83869,2.46889 -0.95194,1.63803 -0.89239,5.20675 0.17364,10.40695 0.90648,4.421902 1.05253,8.458452 0.3882,10.728752 -0.70059,2.39406 -3.81995,5.29609 -6.74745,6.27718 -1.26118,0.42266 -2.96775,0.87096 -3.79236,0.99623 l -1.49931,0.22775 z' style='stroke-width:0.35277778'/%3E%3C/g%3E%3C/svg%3E");
      }

      /* Flexible Containers */
      .remark-container {
        border: thin solid black;
        border-radius: 1rem;
        margin-bottom: 1rem;
      }

      .remark-container-title {
        border-radius: 1rem 1rem 0 0;
        position: relative;
        padding: .5rem 0 .5rem 2.5rem;
        background-color: var(--background);
        background-repeat: no-repeat;
        background-size: 1.75rem;
        background-position-y: center;
        background-position-x: .25rem;
      }

      .remark-container > :not(.remark-container-title) {
        padding: 0 1rem 0 1rem;
      }

      .remark-container-title.warning {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ccircle cx='12' cy='17' r='1' fill='%23ffffff'%3E%3C/circle%3E%3Cpath d='M12 10L12 14' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
      }

      .remark-container-title.note {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' fill='%23ffffff'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ctitle%3Enote-text%3C/title%3E%3Cdesc%3ECreated with Sketch Beta.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'%3E%3Cg id='Icon-Set' sketch:type='MSLayerGroup' transform='translate(-308.000000, -99.000000)' fill='%23ffffff'%3E%3Cpath d='M332,107 L316,107 C315.447,107 315,107.448 315,108 C315,108.553 315.447,109 316,109 L332,109 C332.553,109 333,108.553 333,108 C333,107.448 332.553,107 332,107 L332,107 Z M338,127 C338,128.099 336.914,129.012 335.817,129.012 L311.974,129.012 C310.877,129.012 309.987,128.122 309.987,127.023 L309.987,103.165 C309.987,102.066 310.902,101 312,101 L336,101 C337.098,101 338,101.902 338,103 L338,127 L338,127 Z M336,99 L312,99 C309.806,99 308,100.969 308,103.165 L308,127.023 C308,129.22 309.779,131 311.974,131 L335.817,131 C338.012,131 340,129.196 340,127 L340,103 C340,100.804 338.194,99 336,99 L336,99 Z M332,119 L316,119 C315.447,119 315,119.448 315,120 C315,120.553 315.447,121 316,121 L332,121 C332.553,121 333,120.553 333,120 C333,119.448 332.553,119 332,119 L332,119 Z M332,113 L316,113 C315.447,113 315,113.448 315,114 C315,114.553 315.447,115 316,115 L332,115 C332.553,115 333,114.553 333,114 C333,113.448 332.553,113 332,113 L332,113 Z' id='note-text' sketch:type='MSShapeGroup'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }

      .remark-container-title.experimental {
        background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='designs' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 32 32' xml:space='preserve' fill='%23ffffff'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cstyle type='text/css'%3E .sketchy_een%7Bfill:%23ffffff;%7D %3C/style%3E%3Cpath class='sketchy_een' d='M27.958,26.693c-0.023-0.207-0.066-0.377-0.22-0.531c-0.006-0.006-0.015-0.008-0.021-0.014 c0.06-0.187,0.051-0.395-0.057-0.573c-0.326-0.538-0.64-1.08-0.942-1.631c-0.345-0.629-0.716-1.241-1.059-1.87 c-0.351-0.642-0.676-1.296-1.016-1.942c-0.352-0.675-0.773-1.309-1.142-1.974c-0.506-0.907-0.961-1.842-1.47-2.749 c-0.494-0.88-0.958-1.772-1.422-2.667c0.008-0.161-0.007-0.328-0.012-0.488c-0.004-0.168-0.009-0.337-0.017-0.506 c-0.015-0.364-0.042-0.726-0.064-1.087c-0.045-0.722-0.102-1.444-0.133-2.167c-0.062-1.561-0.036-3.121,0.043-4.68 c0.159,0.001,0.318,0.002,0.478,0.001c0.26-0.004,0.519-0.023,0.779-0.011c0.485,0.023,0.89-0.422,0.89-0.89 c0-0.235-0.095-0.462-0.261-0.629c-0.176-0.178-0.386-0.242-0.629-0.261C21.443,2.005,21.202,2,20.96,2 c-0.264,0-0.528,0.006-0.789,0.008C20.05,2.01,19.929,2.01,19.808,2.01c-0.201,0-0.402,0-0.602,0.002 c-0.347,0.004-0.695,0.026-1.042,0.034c-0.39,0.006-0.782,0.002-1.173,0.01c-0.402,0.01-0.803,0.028-1.203,0.042 c-0.769,0.025-1.536,0.068-2.308,0.068c-0.441,0-0.883,0.004-1.322,0c-0.5-0.004-0.998-0.045-1.499-0.066 c-0.445-0.021-0.818,0.386-0.818,0.818c0,0.458,0.373,0.805,0.818,0.82c0.12,0.004,0.24,0.003,0.36,0.006 c0.038,0.704,0.098,1.408,0.133,2.114c0.036,0.722,0.028,1.444,0.049,2.165c0.021,0.68,0.04,1.362,0.061,2.042 c0.019,0.608,0.055,1.214,0.07,1.822c-0.354,0.653-0.68,1.32-1.049,1.964c-0.195,0.341-0.385,0.682-0.563,1.031 c-0.172,0.333-0.316,0.68-0.468,1.023c-0.15,0.337-0.296,0.676-0.46,1.006c-0.165,0.328-0.333,0.656-0.489,0.987 c-0.165,0.352-0.324,0.708-0.493,1.061c-0.155,0.33-0.328,0.652-0.489,0.979c-0.263,0.534-0.496,1.082-0.746,1.622 c-0.267,0.58-0.525,1.165-0.777,1.752c-0.241,0.561-0.519,1.104-0.758,1.665c-0.225,0.529-0.428,1.068-0.647,1.6 c-0.039,0.093-0.079,0.184-0.118,0.278c-0.052,0.117-0.081,0.229-0.091,0.344c-0.087,0.136-0.152,0.288-0.159,0.459 c-0.019,0.46-0.019,0.911,0.218,1.324c0.159,0.281,0.358,0.478,0.618,0.663c0.135,0.095,0.305,0.14,0.457,0.199 c0.241,0.095,0.519,0.097,0.777,0.114c0.368,0.023,0.733,0.002,1.101-0.009c0.402-0.013,0.801-0.034,1.203-0.062 c0.405-0.03,0.813-0.036,1.218-0.047c0.801-0.025,1.605-0.019,2.406-0.004c0.762,0.013,1.519,0.038,2.279,0.1 c0.765,0.064,1.525,0.066,2.292,0.064c0.159,0,0.32,0,0.479,0c0.64,0.002,1.281,0.002,1.923-0.032 c0.756-0.042,1.514-0.053,2.271-0.085c0.392-0.017,0.781-0.055,1.169-0.093c0.377-0.036,0.756-0.047,1.133-0.062 c0.686-0.027,1.37-0.023,2.05-0.117c0.138-0.019,0.277-0.042,0.415-0.07c0.195-0.042,0.369-0.116,0.551-0.195 c0.282-0.121,0.527-0.314,0.748-0.525c0.275-0.261,0.421-0.599,0.53-0.957c0.097-0.314,0.138-0.656,0.114-0.983 C27.973,26.817,27.965,26.756,27.958,26.693z M15.375,3.768c0.449-0.004,0.9-0.002,1.351,0.002c0.322,0.002,0.644,0.006,0.966,0.004 c0.385-0.001,0.77,0.01,1.154,0.021c-0.028,0.789-0.017,1.581-0.015,2.372c0,0.754-0.009,1.51,0.01,2.264 c0.019,0.716,0.047,1.434,0.1,2.15c0.019,0.259,0.042,0.521,0.062,0.782c-0.342,0.013-0.685,0.025-1.027,0.039 c-0.572,0.021-1.146,0.025-1.718,0.068c-1.152,0.088-2.305,0.091-3.46,0.077c-0.036-0.807-0.057-1.615-0.065-2.424 c0.384-0.011,0.768-0.021,1.152-0.032c0.424-0.013,0.781-0.345,0.781-0.781c0-0.42-0.352-0.781-0.774-0.781 c-0.002,0-0.004,0-0.007,0c-0.389,0.004-0.779,0.008-1.168,0.011c-0.002-0.539,0.001-1.077-0.023-1.615 c-0.032-0.719-0.05-1.437-0.076-2.154C13.537,3.779,14.456,3.778,15.375,3.768z M26.457,27.054c-0.021,0.106-0.049,0.21-0.085,0.312 c-0.036,0.076-0.077,0.15-0.122,0.221c-0.054,0.056-0.112,0.108-0.172,0.159c-0.078,0.053-0.159,0.1-0.243,0.141 c-0.225,0.079-0.462,0.123-0.698,0.158c-0.307,0.032-0.615,0.033-0.922,0.049c-0.311,0.015-0.62,0.043-0.928,0.059 c-0.771,0.034-1.535,0.121-2.306,0.154c-0.758,0.032-1.519,0.034-2.279,0.061c-0.803,0.028-1.608,0.028-2.412,0.019 c-0.377-0.004-0.754-0.002-1.131-0.011c-0.366-0.008-0.729-0.034-1.095-0.059c-0.779-0.049-1.557-0.042-2.338-0.03 c-0.799,0.011-1.599,0.04-2.398,0.057c-0.798,0.017-1.591,0.055-2.389,0.055c-0.263,0.002-0.525-0.011-0.786-0.034 c-0.09-0.015-0.179-0.033-0.266-0.059c-0.03-0.015-0.059-0.032-0.087-0.049c-0.01-0.01-0.021-0.02-0.031-0.03 c-0.011-0.018-0.022-0.036-0.032-0.054c-0.005-0.17,0.01-0.342,0.017-0.511c0.005-0.097-0.021-0.188-0.051-0.275 c0.126-0.329,0.26-0.655,0.383-0.984c0.13-0.346,0.26-0.691,0.401-1.033c0.134-0.304,0.277-0.606,0.412-0.91 c0.007-0.015,0.013-0.031,0.02-0.046c0.333,0.005,0.668,0.002,1-0.004c0.582-0.008,1.165-0.017,1.749,0.021 c0.404,0.027,0.741-0.356,0.741-0.741c0-0.411-0.337-0.731-0.741-0.741c-0.692-0.016-1.384-0.045-2.076-0.07 c0.233-0.516,0.471-1.031,0.707-1.547c0.116-0.252,0.241-0.499,0.365-0.746c0.093,0.037,0.192,0.061,0.296,0.058 c0.36-0.008,0.722-0.021,1.082-0.04c0.258-0.013,0.523-0.049,0.782-0.032c0.436,0.03,0.801-0.386,0.801-0.801 c0-0.458-0.366-0.777-0.801-0.803c-0.023-0.002-0.045-0.002-0.068-0.002c-0.083,0-0.165,0.009-0.249,0.014 c-0.15,0.006-0.301,0.006-0.451,0.008c-0.209,0.002-0.419,0.003-0.628,0.004c0.099-0.22,0.198-0.441,0.301-0.66 c0.157-0.33,0.32-0.654,0.468-0.987c0.078-0.177,0.155-0.354,0.232-0.532c0.057,0.012,0.111,0.034,0.171,0.031 c0.754-0.044,1.506-0.097,2.262-0.14c0.419-0.023,0.771-0.333,0.771-0.771c0-0.426-0.35-0.765-0.771-0.773 c-0.067-0.001-0.133-0.001-0.2-0.001c-0.495,0-0.991,0.026-1.486,0.054c0.052-0.101,0.095-0.206,0.15-0.305 c0.34-0.613,0.68-1.226,1.023-1.838c0.055,0.013,0.107,0.034,0.166,0.034c1.25,0.002,2.497-0.082,3.745-0.146 c0.572-0.028,1.146-0.036,1.718-0.049c0.246-0.006,0.494-0.002,0.741,0c0.059,0.002,0.119,0.002,0.18,0.002 c0.034,0,0.069,0.003,0.103,0.003c0,0.14,0.021,0.28,0.091,0.41c0.383,0.71,0.799,1.404,1.203,2.101 c0.385,0.669,0.763,1.338,1.122,2.021c0.356,0.676,0.709,1.355,1.097,2.012c0.189,0.318,0.4,0.623,0.584,0.945 c0.188,0.324,0.358,0.657,0.53,0.991c0.466,0.89,0.949,1.77,1.47,2.631c0.241,0.398,0.468,0.803,0.703,1.205 c0.21,0.356,0.441,0.705,0.629,1.072c0.021,0.042,0.058,0.068,0.088,0.103c-0.04,0.091-0.062,0.19-0.059,0.295 C26.462,26.814,26.465,26.934,26.457,27.054z M24.139,25.03c0.191,0.358,0.093,0.807-0.267,1.017 c-0.172,0.1-0.381,0.129-0.572,0.076c-0.172-0.047-0.368-0.174-0.445-0.341c-0.481-1.029-1.029-2.027-1.555-3.031 c-0.286-0.546-0.557-1.099-0.852-1.641c-0.313-0.576-0.61-1.157-0.894-1.747c-0.093-0.193-0.136-0.383-0.078-0.593 c0.053-0.193,0.182-0.36,0.354-0.46c0.117-0.069,0.253-0.105,0.389-0.105c0.069,0,0.137,0.009,0.204,0.027 c0.178,0.049,0.379,0.182,0.458,0.354c0.28,0.593,0.557,1.186,0.851,1.771c0.277,0.551,0.54,1.11,0.832,1.654 c0.28,0.521,0.57,1.038,0.839,1.565c0.131,0.26,0.26,0.519,0.396,0.773C23.917,24.575,24.02,24.807,24.139,25.03z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
      }
    </style>
  </head>
  <body>
    ${html.toString()}
  </body>
</html>`);

  console.error(reporter(html));
};

(async function () {
  const files = argv.slice(2);
  if (files.length === 0) {
    console.error("WARNING: No files built. Usage: 'npm run build -- filename.md'");
  }

  for (const filename of files) {
    console.log(`Building: ${filename} ...`);
    await build(filename);
    console.log("");
  }
}());
