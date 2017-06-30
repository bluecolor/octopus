CREATE table frt_table_tp (
  TESISAT_NO NUMBER,
  FATURA_SERI VARCHAR2(1),
  FATURA_NO NUMBER,
  TAKSIT_NO NUMBER,
  SIRA_NO NUMBER, 
  TOPLAM_TUTAR NUMBER,
  SON_ODEME_TARIHI NUMBER,
  GECIKME_TUTARI NUMBER
);



CREATE OR REPLACE PACKAGE pkg_gh AS

  TYPE tp_ftr_rec IS RECORD (
    TESISAT_NO NUMBER,
    FATURA_SERI VARCHAR2(1),
    FATURA_NO NUMBER,
    TAKSIT_NO NUMBER,
    SIRA_NO NUMBER, 
    TOPLAM_TUTAR NUMBER,
    SON_ODEME_TARIHI NUMBER,
    GECIKME_TUTARI NUMBER
  );

  TYPE tp_ftr_tab IS TABLE OF tp_ftr_rec;

  TYPE tp_ftr_tab_cursor IS REF CURSOR RETURN frt_table_tp%ROWTYPE;
  
  FUNCTION run (c  IN  tp_ftr_tab_cursor) RETURN tp_ftr_tab PIPELINED 
  PARALLEL_ENABLE(PARTITION c BY ANY);
    
END ;
/


CREATE OR REPLACE PACKAGE BODY pkg_gh AS

  function run(c  IN  tp_ftr_tab_cursor) RETURN tp_ftr_tab PIPELINED
  PARALLEL_ENABLE(PARTITION c BY ANY)
  is
    store tp_ftr_tab; -- will bulk collect into this store
    p tp_ftr_rec;     -- records will be processed in this variable
  begin
    
    LOOP  
      FETCH c bulk collect into store;
      EXIT WHEN c%NOTFOUND;
      
      for i in store.first .. store.last loop 
        p := store(i); -- each record will be stored to the intermediate rec. "p"  
        p.GECIKME_TUTARI := 0; -- calc here; store calculation results in p.xyz

        /*
            other calculations and initializations...
            eg: 
              p.X := store(i).X;
              p.TESISAT_NO := store(i).TESISAT_NO;
        */
        pipe row(p); 
      end loop; -- end for loop
    
    end loop; -- end outer loop fur cursor

    return;
  end; -- end method

END ; -- end package


SELECT 
*
FROM  TABLE(pkg_gh.run(
    CURSOR(
        SELECT --+parallel (f,16)
            F.TESISAT_NO, 
            FATURA_SERI,
            FATURA_NO,
            0 TAKSIT_NO,
            0  SIRA_NO, 
            F.TOPLAM_TUTAR,
            F.SON_ODEME_TARIHI,
            0 GECIKME_TUTARI
        FROM fatura F
        WHERE F.KAPATMA_TARIHI =0
        AND F.FATURA_KODU NOT IN (2,4,9,12,13)
        ) 
    ) 
) A;
