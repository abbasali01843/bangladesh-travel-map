"use client";
import { useEffect } from "react";
import { Manchitro, resolveDistrict, type ValidDistrict } from "manchitro";
import { districts } from "../data/districts";

const EN:Record<string,string>={
barguna:"Barguna",barishal:"Barishal",bhola:"Bhola",jhalokathi:"Jhalokati",patuakhali:"Patuakhali",pirojpur:"Pirojpur",
bandarban:"Bandarban",brahmanbaria:"Brahmanbaria",chandpur:"Chandpur",chattogram:"Chattogram",cumilla:"Cumilla",coxsbazar:"Cox's Bazar",feni:"Feni",khagrachhari:"Khagrachhari",lakshmipur:"Lakshmipur",noakhali:"Noakhali",rangamati:"Rangamati",
dhaka:"Dhaka",faridpur:"Faridpur",gazipur:"Gazipur",gopalganj:"Gopalganj",kishoreganj:"Kishoreganj",madaripur:"Madaripur",manikganj:"Manikganj",munshiganj:"Munshiganj",narayanganj:"Narayanganj",narsingdi:"Narsingdi",rajbari:"Rajbari",shariatpur:"Shariatpur",tangail:"Tangail",
bagerhat:"Bagerhat",chuadanga:"Chuadanga",jessore:"Jashore",jhenaidah:"Jhenaidah",khulna:"Khulna",kushtia:"Kushtia",magura:"Magura",meherpur:"Meherpur",narail:"Narail",satkhira:"Satkhira",
jamalpur:"Jamalpur",mymensingh:"Mymensingh",netrokona:"Netrokona",sherpur:"Sherpur",
bogura:"Bogura",joypurhat:"Joypurhat",naogaon:"Naogaon",natore:"Natore",chapainawabganj:"Chapainawabganj",pabna:"Pabna",rajshahi:"Rajshahi",sirajganj:"Sirajganj",
dinajpur:"Dinajpur",gaibandha:"Gaibandha",kurigram:"Kurigram",lalmonirhat:"Lalmonirhat",nilphamari:"Nilphamari",panchagarh:"Panchagarh",rangpur:"Rangpur",thakurgaon:"Thakurgaon",
habiganj:"Habiganj",moulvibazar:"Moulvibazar",sunamganj:"Sunamganj",sylhet:"Sylhet"
};
const idByMapName=new Map<string,string>();
const mapItems= districts.map(d=>{const name=resolveDistrict(EN[d.id]); if(name) idByMapName.set(name,d.id); return name;}).filter(Boolean) as ValidDistrict[];

export function BangladeshDistrictMap({visited,onToggle}:{visited:string[];onToggle:(id:string)=>void}){
 const selected=visited.map(id=>resolveDistrict(EN[id])).filter(Boolean) as ValidDistrict[];
 useEffect(()=>{ const root=document.querySelector(".ghurechi-map"); if(!root)return; root.querySelectorAll<SVGGElement>("svg g[aria-label]").forEach(g=>{const id=idByMapName.get(g.getAttribute("aria-label")||""); const on=!!id&&visited.includes(id); g.classList.toggle("ghurechi-visited",on); g.querySelectorAll<SVGElement>("path,polygon,polyline").forEach(el=>{el.style.fill=on?"#059669":"";el.style.stroke=on?"#064e3b":"";});}); },[visited]);
 return <div className="ghurechi-map">
  <Manchitro items={mapItems} value={selected[selected.length-1]??null} onSelect={(name)=>{const id=idByMapName.get(name);if(id)onToggle(id)}} colors={{base:"#e8eeeb",active:"#b7dfd0",selected:"#059669",stroke:"#ffffff",selectedStroke:"#064e3b"}} className="w-full" svgStyle={{width:"100%",height:"auto",maxHeight:"680px"}} />
  <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs font-bold text-slate-500"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#e8eeeb] align-middle"/>এখনও যাওয়া হয়নি</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#059669] align-middle"/>ঘুরে দেখেছেন</span></div>
 </div>;
}
