/* eslint-disable max-len */

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const GDPR_REGULATION = {
  title: 'DECLARAȚIE',
  subtitle:
    'privind colectarea, stocarea și prelucrarea datelor cu caracter personal în cadru sistemului informațional www.zilieri.gov.md',
  regulations: [
    {
      id: 1,
      content:
        'Declar pe propria răspundere că în exercitarea atribuțiilor funcționale și pe toată durata gestionării profilului de în sistemul informațional  www.zilieri.gov.md, în calitatea mea de angajator, mă oblig să respect cadrul normativ național în domeniul colectării, stocării și prelucrării datelor cu caracter personal la înregistrarea persoanelor care prestează munca în conformitate cu prevederile Legii nr. 22/2018 privind exercitarea unor activități necalificate cu caracter ocazional desfășurate de zilieri.',
    },
    {
      id: 2,
      content:
        'Confirm pe propria răspundere cunoașterea faptului că datele cu caracter personal ale persoanelor înregistrate în sistemul informațional www.zilieri.gov.md sunt prelucrate cu respectarea regimului de securitate și confidențialitate, în conformitate cu prevederile Legii nr. 133/2011 privind protecția datelor cu caracter personal și ale Hotărârii Guvernului nr. 1123/2010 privind aprobarea Cerințelor față de asigurarea securității datelor cu caracter personal la prelucrarea acestora în cadrul sistemelor informaționale de date cu caracter personal.',
    },
    {
      id: 3,
      content:
        'Confirm pe propria răspundere că persoanele înregistrate în sistemul informațional www.zilieri.gov.md au exprimat consimțământul privind colectarea, stocarea și prelucrarea datelor cu caracter personal, care mi-au fost oferite în calitatea mea de angajator, de către operatorul sistemului informațional, în vederea îndeplinirii obligațiilor legale ce revin acestuia, în implementarea programului „Vouchere digitale pentru zilieri ”.',
    },
    {
      id: 4,
      content:
        'Confirm pe propria răspundere că persoanele înregistrate în sistemul informațional www.zilieri.gov.md au fost informate referitor la prevederile art. 12 din Legea nr. 133/2011 privind protecția datelor cu caracter personal și că li s-au adus la cunoștință drepturile de care dispun, prevăzute în art.12-18 din Legea respectivă (dreptul de a fi informat, dreptul de acces, de intervenție, de opoziție, precum și de a se adresa în instanța de judecată, în contextul prelucrării efectuate asupra datelor cu caracter personal ce îi vizează).',
    },
    {
      id: 5,
      content:
        'Declar pe propria răspundere că în exercitarea atribuțiilor funcționale și pe toată durata gestionării profilului din sistemul informațional  www.zilieri.gov.md, în calitatea mea de angajator, mă oblig să respect confidențialitatea informațiilor și documentelor de al căror conținut voi lua cunoștință pe parcurs, să iau toate măsurile asiguratorii corespunzătoare la utilizarea, furnizarea și stocarea acestora în sistemul informațional respectiv, inclusiv:',
      list: [
        {
          id: 1,
          content: 'să tratez cu diligență conținutul datelor;',
        },
        {
          id: 2,
          content:
            'să nu divulg terțelor persoane neautorizate, conținutul datelor, pe cale verbală, scrisă sau prin mijloace tehnice, pe cale directă sau incidentală;',
        },
        {
          id: 3,
          content:
            'să nu public datele pe alte pagini web, decât sistemul informațional  www.zilieri.gov.md, inclusiv pe rețele de socializare;',
        },
        {
          id: 4,
          content:
            'să nu realizez multiplicarea electronică și pe echipamente tehnice a datelor, inclusiv prin poșta electronică, prin încărcare pe dispozitive de memorie externă sau portaluri de acces online (Google Drive, iCloud etc.), prin înregistrare video sau fotografiere;',
        },
        {
          id: 5,
          content: 'să iau orice măsuri necesare în sensul protecției datelor.',
        },
      ],
    },
  ],
  footer:
    'Confirm pe propria răspundere că potrivit capacităților și principiilor de activitate (ale entității), pot lua decizii în mod independent, fără a fi influențat(ă) de careva terțe părți neautorizate, din exterior.',
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    maxWidth: '1000px',
    width: '100%',
    minHeight: '100vh',
    padding: theme.spacing(1),
    gap: theme.spacing(2),
    textWrap: 'pretty',
  },
  title: {
    width: '100%',
    maxWidth: '80%',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  footer: {
    marginTop: theme.spacing(2),
    width: '100%',
    maxWidth: '80%',
    textAlign: 'center',
  },
  regulations: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  regulationContent: {
    textAlign: 'center',
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    justifyContent: 'start',
    alignItems: 'start',
  },
}));

function PublicGDPRPage() {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <Typography style={{ fontSize: '24px', fontWeight: '700' }}>{GDPR_REGULATION.title}</Typography>
          <Typography>{GDPR_REGULATION.subtitle}</Typography>
        </div>
        <div className={classes.regulations}>
          {GDPR_REGULATION.regulations.map((regulation) => (
            <div key={regulation.id}>
              <div className={classes.regulationContent}>
                <Typography>{regulation.content}</Typography>
              </div>

              {regulation.list && (
                <ul className={classes.list}>
                  {regulation.list.map((item) => (
                    <li key={item.id}>
                      <Typography>{item.content}</Typography>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className={classes.footer}>
          <Typography>{GDPR_REGULATION.footer}</Typography>
        </div>
      </div>
    </div>
  );
}

export default PublicGDPRPage;
