import Button from "./components/Button";
import Card from "./components/Card";
import Badge from "./components/Badge";
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-teal-400">It works!</h1>
      <Button onClick={() => alert("clicked!")}>Test Button</Button>
      <Card>
        <p className="text-white">This is a card!</p>
      </Card>
      <Badge color="teal">Low Risk</Badge>



    </div>
  );
}