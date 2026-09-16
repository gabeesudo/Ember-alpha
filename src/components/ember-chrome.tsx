import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame } from "./ember-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
export const RELEASE = 'Kaizen — v0.1.0-alpha "Ember"';
export function EmberBar() {
 const [about,setAbout]=useState(false);
 return <><header className="os-menu"><Link to="/" className="os-brand" aria-label="Kaizen, início"><Flame/><strong>Kaizen</strong></Link><span className="menu-divider"/><span className="os-edition">Ember</span><button className="os-menu-action" onClick={()=>setAbout(true)}>Sobre</button><span className="os-version">v0.1.0-alpha</span></header>
 <Dialog open={about} onOpenChange={setAbout}><DialogContent><DialogHeader><DialogTitle>Sobre o Kaizen</DialogTitle><DialogDescription>Seu progresso, uma missão de cada vez.</DialogDescription></DialogHeader><div className="about-mark"><Flame/></div><p className="release-label">{RELEASE}</p><p>Crie missões, ganhe experiência e desenvolva os atributos do seu personagem.</p><Button onClick={()=>setAbout(false)}>Continuar</Button></DialogContent></Dialog></>;
}
export function EmberStatus(){return <footer className="os-status"><span>{RELEASE}</span><span className="status-end"><Flame/> Um passo de cada vez.</span></footer>;}
export function WindowTitle({children,code}:{children:React.ReactNode;code?:string}){return <div className="window-title"><span className="window-grip" aria-hidden="true"/><span className="window-caption">{children}</span><span className="window-code">{code}</span></div>;}
