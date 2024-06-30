import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const interventions = [
  { id: 'vmc', content: 'Voluntary medical male circumcision', category: 'medical' },
  { id: 'prep', content: 'PrEP', category: 'medical' },
  { id: 'pep', content: 'PEP', category: 'medical' },
  { id: 'art', content: 'ART as Treatment', category: 'medical' },
  { id: 'harm', content: 'Harm Reduction', category: 'medical' },
  { id: 'laws', content: 'Change of laws', category: 'structural' },
  { id: 'economic', content: 'Economic Opportunities', category: 'structural' },
  { id: 'corruption', content: 'Deal with corruption', category: 'structural' },
  { id: 'awareness', content: 'Awareness Campaigns', category: 'social' },
  { id: 'support', content: 'Support Groups', category: 'social' },
];

const categories = [
  { id: 'medical', title: 'Medical Interventions' },
  { id: 'structural', title: 'Structural Interventions' },
  { id: 'social', title: 'Social Interventions' },
];

const InterventionGame = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const resetGame = () => {
    setItems(shuffleArray(interventions).map(item => ({ ...item, userCategory: null, isCorrect: null })));
    setSelectedItem(null);
    setScore(0);
    setGameEnded(false);
    setShowInfoModal(false);
  };

  const handleItemClick = (item) => {
    if (!gameEnded) {
      setSelectedItem(item.id === selectedItem ? null : item.id);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedItem && !gameEnded) {
      setItems(items.map(item => 
        item.id === selectedItem ? { ...item, userCategory: categoryId, isCorrect: null } : item
      ));
      setSelectedItem(null);
    }
  };

  const checkAnswers = () => {
    const newItems = items.map(item => ({
      ...item,
      isCorrect: item.category === item.userCategory
    }));
    const correctAnswers = newItems.filter(item => item.isCorrect).length;
    setItems(newItems);
    setScore(correctAnswers);
    setGameEnded(true);
  };

  const getItemStyle = (item) => {
    if (gameEnded) {
      return item.isCorrect
        ? 'bg-green-100 border-green-500'
        : 'bg-red-100 border-red-500';
    }
    return selectedItem === item.id ? 'border-blue-500' : 'border-gray-200';
  };

  const InfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">HIV Combination Prevention</h2>
        <p className="mb-4">
          HIV combination prevention refers to the use of multiple strategies to prevent HIV transmission. 
          These strategies fall into three main categories:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Medical Interventions:</strong> These include biomedical approaches such as PrEP, PEP, ART, and voluntary medical male circumcision.</li>
          <li><strong>Structural Interventions:</strong> These address social, economic, and political factors that influence HIV risk and vulnerability.</li>
          <li><strong>Social Interventions:</strong> These focus on changing individual and community behaviors through education, counseling, and support.</li>
        </ul>
        <p className="mb-4">
          By combining these approaches, HIV combination prevention aims to provide a comprehensive and effective strategy to reduce HIV transmission.
        </p>
        <Button onClick={() => setShowInfoModal(false)} className="w-full">Close</Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">HIV Combination Prevention Game</h1>
      <p className="text-lg mb-4 text-center">Categorize each intervention into the correct prevention strategy.</p>
      <div className="flex flex-wrap -mx-2">
        {categories.map((category) => (
          <div key={category.id} className="w-full md:w-1/3 px-2 mb-4">
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <div 
              className="bg-gray-100 p-4 rounded-lg min-h-[200px] cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              {items
                .filter(item => item.userCategory === category.id)
                .map(item => (
                  <div 
                    key={item.id}
                    className={`p-2 mb-2 rounded shadow border-2 ${getItemStyle(item)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    {item.content}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Available Interventions:</h3>
        <div className="flex flex-wrap gap-2">
          {items
            .filter(item => !item.userCategory)
            .map(item => (
              <div 
                key={item.id}
                className={`p-2 rounded shadow cursor-pointer border-2 ${getItemStyle(item)}`}
                onClick={() => handleItemClick(item)}
              >
                {item.content}
              </div>
            ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button
          onClick={gameEnded ? resetGame : checkAnswers}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg"
        >
          {gameEnded ? 'Play Again' : 'Check Answers'}
        </Button>
        {gameEnded && (
          <Button
            onClick={() => setShowInfoModal(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg ml-4"
          >
            Learn More
          </Button>
        )}
      </div>
      {gameEnded && (
        <Alert className="mt-6">
          <AlertTitle>Game Over!</AlertTitle>
          <AlertDescription>
            Your score: {score} out of {interventions.length} correct
          </AlertDescription>
        </Alert>
      )}
      {showInfoModal && <InfoModal />}
    </div>
  );
};

export default InterventionGame;
