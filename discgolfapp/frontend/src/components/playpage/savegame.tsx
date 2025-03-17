

export default function handler(req: { method: string; body: { course: any; throws: any; baskets: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
    if (req.method === "POST") {
      const { course, throws, baskets } = req.body;
  
      console.log("Mottatt data:", { course, throws, baskets });
  
      // Her kan du lagre data i en database (må settes opp senere)
      
      return res.status(200).json({ message: "Spill lagret!" });
    }
  
    res.status(405).json({ message: "Kun POST tillatt" });
  }
  