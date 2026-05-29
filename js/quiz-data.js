// 中小企業診断士試験 過去問データベース
const QUIZ_DATA = {
    // 経済学・経済政策
    economics: [
        {
            id: 'eco_001',
            subject: 'economics',
            subjectName: '経済学・経済政策',
            year: 2023,
            difficulty: 'medium',
            question: '完全競争市場における企業の短期均衡について、正しい記述はどれか。',
            options: [
                '企業は必ず正の経済利潤を得る',
                '企業の供給曲線は限界費用曲線と一致する',
                '企業は価格を自由に設定できる',
                '企業の需要曲線は右下がりである',
                '企業は長期的には市場から退出する'
            ],
            correctAnswer: 1,
            explanation: '完全競争市場では、企業は価格受容者であり、価格は市場で決定されます。企業の供給曲線は、平均可変費用を上回る部分の限界費用曲線と一致します。'
        },
        {
            id: 'eco_002',
            subject: 'economics',
            subjectName: '経済学・経済政策',
            year: 2023,
            difficulty: 'hard',
            question: 'IS-LM分析において、財政政策の効果が最も大きくなるのはどのような場合か。',
            options: [
                'IS曲線の傾きが急で、LM曲線の傾きが緩やかな場合',
                'IS曲線の傾きが緩やかで、LM曲線の傾きが急な場合',
                'IS曲線とLM曲線の傾きが共に急な場合',
                'IS曲線とLM曲線の傾きが共に緩やかな場合',
                'IS曲線とLM曲線が平行な場合'
            ],
            correctAnswer: 1,
            explanation: 'IS曲線の傾きが緩やか（投資の利子弾力性が大）で、LM曲線の傾きが急（貨幣需要の利子弾力性が小）な場合、財政政策による金利上昇が投資を大きく減少させず、クラウディングアウト効果が小さくなるため、財政政策の効果が大きくなります。'
        },
        {
            id: 'eco_003',
            subject: 'economics',
            subjectName: '経済学・経済政策',
            year: 2022,
            difficulty: 'easy',
            question: '需要の価格弾力性が1より大きい場合、価格を10%下落させると総収入はどうなるか。',
            options: [
                '10%増加する',
                '10%減少する',
                '変化しない',
                '10%より大きく増加する',
                '10%より大きく減少する'
            ],
            correctAnswer: 3,
            explanation: '需要の価格弾力性が1より大きい場合（弾力的）、価格の下落率よりも需要量の増加率の方が大きくなるため、総収入（価格×数量）は増加します。価格弾力性が1より大きいので、10%より大きく増加します。'
        },
        {
            id: 'eco_004',
            subject: 'economics',
            subjectName: '経済学・経済政策',
            year: 2022,
            difficulty: 'medium',
            question: 'フィリップス曲線に関する記述として正しいのはどれか。',
            options: [
                'インフレ率と失業率の間に正の相関関係を示す',
                'インフレ率と失業率の間に負の相関関係を示す',
                'GDP成長率と失業率の間に正の相関関係を示す',
                '財政赤字と金利の間の関係を示す',
                '輸出と輸入の関係を示す'
            ],
            correctAnswer: 1,
            explanation: 'フィリップス曲線はインフレ率と失業率の間に負の相関（トレードオフ）があることを示します。失業率が低い時はインフレ率が高く、失業率が高い時はインフレ率が低い傾向があります。'
        },
        {
            id: 'eco_005',
            subject: 'economics',
            subjectName: '経済学・経済政策',
            year: 2021,
            difficulty: 'hard',
            question: 'マンデル＝フレミングモデルにおいて、変動為替相場制かつ資本移動が完全な場合、財政政策の効果に関する正しい記述はどれか。',
            options: [
                '財政政策は国民所得を増加させる効果が大きい',
                '財政政策は為替レートに影響しない',
                '財政政策は完全に無効化される',
                '財政政策は輸出を増加させる',
                '財政政策は金利を低下させる'
            ],
            correctAnswer: 2,
            explanation: '変動為替相場制かつ資本移動完全な場合、財政拡大→金利上昇→資本流入→通貨高→純輸出減少となり、財政政策の効果が完全に相殺（クラウディングアウト）されます。これをマンデル＝フレミングモデルの結論と言います。'
        }
    ],

    // 財務・会計
    finance: [
        {
            id: 'fin_001',
            subject: 'finance',
            subjectName: '財務・会計',
            year: 2023,
            difficulty: 'medium',
            question: '自己資本比率が30%、総資本利益率（ROA）が10%の企業の自己資本利益率（ROE）は何%か。',
            options: [
                '3.0%',
                '13.0%',
                '30.0%',
                '33.3%',
                '40.0%'
            ],
            correctAnswer: 3,
            explanation: '自己資本利益率（ROE）= 総資本利益率（ROA）÷ 自己資本比率の関係があります。ROE = 10% ÷ 0.3 = 33.3%になります。'
        },
        {
            id: 'fin_002',
            subject: 'finance',
            subjectName: '財務・会計',
            year: 2023,
            difficulty: 'hard',
            question: '正味現在価値（NPV）法による投資判断において、正しい記述はどれか。',
            options: [
                'NPVが正の場合、投資を行うべきではない',
                'NPVが負の場合、投資収益率が資本コストを上回る',
                'NPVが0の場合、投資収益率と資本コストが等しい',
                'NPVは割引率に依存しない',
                'NPVが大きいほど投資期間が長い'
            ],
            correctAnswer: 2,
            explanation: 'NPVが0の場合、投資から得られる収益率と資本コスト（割引率）が等しくなります。NPVが正なら投資すべき、負なら投資すべきでないと判断します。'
        },
        {
            id: 'fin_003',
            subject: 'finance',
            subjectName: '財務・会計',
            year: 2022,
            difficulty: 'easy',
            question: '貸借対照表において、資産の部の記載順序として正しいのはどれか。',
            options: [
                '流動性の高い順',
                '流動性の低い順',
                '金額の大きい順',
                '金額の小さい順',
                '取得年月日順'
            ],
            correctAnswer: 0,
            explanation: '貸借対照表の資産の部は、流動性の高い順（現金化しやすい順）に記載されます。つまり、流動資産、固定資産の順に配列されます。'
        },
        {
            id: 'fin_004',
            subject: 'finance',
            subjectName: '財務・会計',
            year: 2022,
            difficulty: 'medium',
            question: '損益分岐点分析において、固定費が120万円、変動費率が40%の場合、損益分岐点売上高はいくらか。',
            options: [
                '168万円',
                '200万円',
                '240万円',
                '300万円',
                '480万円'
            ],
            correctAnswer: 1,
            explanation: '損益分岐点売上高 = 固定費 ÷ (1 - 変動費率) = 120万円 ÷ (1 - 0.4) = 120万円 ÷ 0.6 = 200万円となります。'
        },
        {
            id: 'fin_005',
            subject: 'finance',
            subjectName: '財務・会計',
            year: 2021,
            difficulty: 'hard',
            question: 'デュポン分析においてROEを分解した場合、正しい式はどれか。',
            options: [
                'ROE = 売上高純利益率 × 総資産回転率',
                'ROE = 売上高純利益率 × 総資産回転率 × 財務レバレッジ',
                'ROE = 売上高総利益率 × 総資産回転率',
                'ROE = 営業利益率 × 総資産回転率 × 財務レバレッジ',
                'ROE = 売上高純利益率 ÷ 自己資本比率'
            ],
            correctAnswer: 1,
            explanation: 'デュポン分析では ROE = 売上高純利益率 × 総資産回転率 × 財務レバレッジ（= 総資産/自己資本）と分解できます。これにより収益性・効率性・財務安全性のどの要素がROEに影響しているか分析できます。'
        }
    ],

    // 企業経営理論
    management: [
        {
            id: 'mgmt_001',
            subject: 'management',
            subjectName: '企業経営理論',
            year: 2023,
            difficulty: 'medium',
            question: 'ポーターの競争優位の戦略において、コストリーダーシップ戦略の特徴として正しいのはどれか。',
            options: [
                '高品質・高価格で差別化を図る',
                '特定の顧客セグメントに集中する',
                '業界全体で最低コストを実現する',
                '製品の多様化を進める',
                'ブランド力の向上を重視する'
            ],
            correctAnswer: 2,
            explanation: 'コストリーダーシップ戦略は、業界全体の中で最低コストを実現し、競合他社よりも低価格で製品・サービスを提供することで競争優位を築く戦略です。'
        },
        {
            id: 'mgmt_002',
            subject: 'management',
            subjectName: '企業経営理論',
            year: 2023,
            difficulty: 'hard',
            question: 'ハーズバーグの二要因理論において、動機付け要因に該当するものはどれか。',
            options: [
                '給与・報酬',
                '職場の人間関係',
                '会社の方針・管理',
                '仕事の達成感',
                '労働条件'
            ],
            correctAnswer: 3,
            explanation: 'ハーズバーグの二要因理論では、動機付け要因（満足要因）として仕事の達成感、承認、責任、昇進などがあり、衛生要因（不満足要因）として給与、人間関係、労働条件などがあります。'
        },
        {
            id: 'mgmt_003',
            subject: 'management',
            subjectName: '企業経営理論',
            year: 2022,
            difficulty: 'easy',
            question: 'SWOT分析の4つの要素として正しい組み合わせはどれか。',
            options: [
                '強み・弱み・機会・競合',
                '強み・弱み・機会・脅威',
                '売上・利益・成長・収益性',
                '品質・価格・納期・サービス',
                '計画・実行・評価・改善'
            ],
            correctAnswer: 1,
            explanation: 'SWOT分析は、Strengths（強み）、Weaknesses（弱み）、Opportunities（機会）、Threats（脅威）の4つの要素から構成されます。'
        },
        {
            id: 'mgmt_004',
            subject: 'management',
            subjectName: '企業経営理論',
            year: 2022,
            difficulty: 'medium',
            question: 'プロダクト・ライフサイクルの「成熟期」の特徴として正しいのはどれか。',
            options: [
                '市場の急激な成長と多くの新規参入者',
                '市場の認知度が低く、売上が緩やかに増加する',
                '売上が安定し、競争が激化して利益が低下しやすい',
                '売上と利益が急激に減少する',
                '製品開発投資が最も大きい時期'
            ],
            correctAnswer: 2,
            explanation: '成熟期は市場が飽和し、売上は横ばいまたは緩やかに増加しますが、競争激化により利益は低下しやすい時期です。企業はコスト削減や市場シェア維持に注力します。'
        },
        {
            id: 'mgmt_005',
            subject: 'management',
            subjectName: '企業経営理論',
            year: 2021,
            difficulty: 'hard',
            question: 'バランスト・スコアカード（BSC）の4つの視点として正しい組み合わせはどれか。',
            options: [
                '財務・顧客・社内プロセス・学習と成長',
                '財務・市場・競合・イノベーション',
                '売上・コスト・品質・顧客満足',
                '短期・中期・長期・永続的目標',
                '計画・組織・人事・統制'
            ],
            correctAnswer: 0,
            explanation: 'バランスト・スコアカードは財務の視点・顧客の視点・社内ビジネスプロセスの視点・学習と成長の視点の4つから組織のパフォーマンスを多角的に評価するフレームワークです。キャプランとノートンが提唱しました。'
        }
    ],

    // 運営管理
    operations: [
        {
            id: 'ops_001',
            subject: 'operations',
            subjectName: '運営管理',
            year: 2023,
            difficulty: 'medium',
            question: 'JIT（Just In Time）生産方式の特徴として正しいのはどれか。',
            options: [
                '大量生産による規模の経済を追求する',
                '在庫を最小限に抑え、必要な時に必要な分だけ生産する',
                '予測に基づいて事前に大量生産する',
                '製品の種類を限定して効率化を図る',
                '自動化を最優先に進める'
            ],
            correctAnswer: 1,
            explanation: 'JIT生産方式は、必要な時に、必要な分だけ、必要な製品を生産することで在庫を最小限に抑え、ムダを排除する生産方式です。'
        },
        {
            id: 'ops_002',
            subject: 'operations',
            subjectName: '運営管理',
            year: 2023,
            difficulty: 'hard',
            question: 'ABC分析において、Aランクの商品の管理方法として最も適切なのはどれか。',
            options: [
                '在庫量を多めに保ち、欠品を防ぐ',
                '発注頻度を少なくし、管理コストを削減する',
                '厳密な在庫管理を行い、頻繁に発注する',
                '自動発注システムに完全に依存する',
                '季節変動を無視した定期発注を行う'
            ],
            correctAnswer: 2,
            explanation: 'ABC分析のAランク商品は売上高への貢献度が高いため、厳密な在庫管理を行い、欠品による機会損失を避けるために頻繁に発注することが重要です。'
        },
        {
            id: 'ops_003',
            subject: 'operations',
            subjectName: '運営管理',
            year: 2022,
            difficulty: 'easy',
            question: '品質管理におけるPDCAサイクルの正しい順序はどれか。',
            options: [
                'Plan → Do → Check → Action',
                'Plan → Action → Do → Check',
                'Do → Plan → Check → Action',
                'Check → Plan → Do → Action',
                'Action → Plan → Do → Check'
            ],
            correctAnswer: 0,
            explanation: 'PDCAサイクルは、Plan（計画）→ Do（実行）→ Check（確認・評価）→ Action（改善）の順序で継続的改善を行うマネジメント手法です。'
        },
        {
            id: 'ops_004',
            subject: 'operations',
            subjectName: '運営管理',
            year: 2022,
            difficulty: 'medium',
            question: '小売業のサプライチェーン管理で活用されるEDI（Electronic Data Interchange）の主な目的はどれか。',
            options: [
                '消費者の購買意欲を高める広告配信',
                '企業間の取引データをコンピューター間で直接交換する',
                '従業員の勤怠管理を効率化する',
                '店舗のレイアウトを最適化する',
                '廃棄物の削減とリサイクルを推進する'
            ],
            correctAnswer: 1,
            explanation: 'EDI（電子データ交換）は、発注書・納品書・請求書などの取引データを標準フォーマットでコンピューター間が直接交換する仕組みです。手作業を削減し、取引の迅速化・コスト削減に貢献します。'
        },
        {
            id: 'ops_005',
            subject: 'operations',
            subjectName: '運営管理',
            year: 2021,
            difficulty: 'hard',
            question: 'サービスの品質管理においてSERVQUAL（サービスクオール）モデルが定義する5つの品質次元に含まれないのはどれか。',
            options: [
                '有形性（Tangibles）',
                '信頼性（Reliability）',
                '反応性（Responsiveness）',
                '価格競争力（Price Competitiveness）',
                '共感性（Empathy）'
            ],
            correctAnswer: 3,
            explanation: 'SERVQUALモデルの5次元は①有形性②信頼性③反応性④確実性（Assurance）⑤共感性です。価格競争力はSERVQUALの品質次元には含まれません。このモデルはParasuraman・Zeithaml・Berryが開発しました。'
        }
    ],

    // 経営法務
    legal: [
        {
            id: 'leg_001',
            subject: 'legal',
            subjectName: '経営法務',
            year: 2023,
            difficulty: 'medium',
            question: '株式会社の機関設計において、取締役会設置会社の必須機関はどれか。',
            options: [
                '取締役のみ',
                '取締役と監査役',
                '取締役と会計参与',
                '取締役、監査役、会計監査人',
                '取締役、執行役、監査委員会'
            ],
            correctAnswer: 1,
            explanation: '取締役会設置会社では、取締役（3名以上）と監査役の設置が義務付けられています。ただし、監査等委員会設置会社や指名委員会等設置会社では異なります。'
        },
        {
            id: 'leg_002',
            subject: 'legal',
            subjectName: '経営法務',
            year: 2023,
            difficulty: 'hard',
            question: '知的財産権の保護期間について正しい記述はどれか。',
            options: [
                '特許権は出願から20年間保護される',
                '実用新案権は登録から10年間保護される',
                '意匠権は登録から15年間保護される',
                '商標権は登録から永続的に保護される',
                '著作権は創作から50年間保護される'
            ],
            correctAnswer: 0,
            explanation: '特許権の保護期間は出願日から20年間です。実用新案権は出願日から10年間、意匠権は登録日から25年間、商標権は登録日から10年間（更新可能）、著作権は著作者の死後70年間（法人著作は公表後70年間）保護されます。'
        },
        {
            id: 'leg_003',
            subject: 'legal',
            subjectName: '経営法務',
            year: 2022,
            difficulty: 'easy',
            question: '契約の成立要件として必要なものはどれか。',
            options: [
                '申込みと承諾の合致',
                '書面による契約書の作成',
                '公証人による認証',
                '印鑑証明書の添付',
                '法務局への登記'
            ],
            correctAnswer: 0,
            explanation: '契約は当事者間の申込みと承諾の意思表示が合致することにより成立します。書面の作成や公証は原則として不要です（一部例外あり）。'
        },
        {
            id: 'leg_004',
            subject: 'legal',
            subjectName: '経営法務',
            year: 2022,
            difficulty: 'medium',
            question: '株式会社における会社法上の公開会社の定義として正しいのはどれか。',
            options: [
                '上場企業のこと',
                '株式の全部または一部を自由に譲渡できる会社',
                '資本金が1億円以上の会社',
                '従業員が300人以上の会社',
                '複数の株主がいる会社'
            ],
            correctAnswer: 1,
            explanation: '会社法における「公開会社」とは、発行する株式の全部または一部について定款で株式の譲渡制限を設けていない会社のことです。証券取引所に上場しているかどうかとは無関係です。'
        },
        {
            id: 'leg_005',
            subject: 'legal',
            subjectName: '経営法務',
            year: 2021,
            difficulty: 'hard',
            question: '会社法における株主代表訴訟に関する記述として正しいのはどれか。',
            options: [
                '株主が直接取締役に損害賠償請求する訴訟',
                '株主が会社を代表して取締役の責任を追及する訴訟',
                '複数の株主が共同で会社に対して起こす訴訟',
                '社外取締役のみが対象となる訴訟',
                '提訴するには総株主の同意が必要'
            ],
            correctAnswer: 1,
            explanation: '株主代表訴訟は株主が会社に代わって（代表して）取締役等の責任を追及する訴訟です。まず会社に対して提訴請求を行い、60日以内に会社が訴訟を提起しない場合に株主が提訴できます。1株以上保有する単独株主権です。'
        }
    ],

    // 経営情報システム
    it: [
        {
            id: 'it_001',
            subject: 'it',
            subjectName: '経営情報システム',
            year: 2023,
            difficulty: 'medium',
            question: 'ERPシステムの特徴として正しいのはどれか。',
            options: [
                '部門別に独立したシステムを構築する',
                '企業の基幹業務を統合的に管理する',
                '特定の業務のみに特化したシステム',
                '外部企業とのデータ交換に特化する',
                '個人の業務効率化のみを目的とする'
            ],
            correctAnswer: 1,
            explanation: 'ERP（Enterprise Resource Planning）システムは、企業の販売、購買、生産、会計などの基幹業務を統合的に管理するシステムです。'
        },
        {
            id: 'it_002',
            subject: 'it',
            subjectName: '経営情報システム',
            year: 2023,
            difficulty: 'hard',
            question: 'クラウドコンピューティングのサービスモデルのうち、SaaS（Software as a Service）の説明として正しいのはどれか。',
            options: [
                'サーバーやストレージなどのインフラをサービスとして提供',
                'OSやミドルウェアなどのプラットフォームをサービスとして提供',
                'アプリケーションソフトウェアをサービスとして提供',
                'セキュリティ機能のみをサービスとして提供',
                'ネットワーク機能のみをサービスとして提供'
            ],
            correctAnswer: 2,
            explanation: 'SaaS（Software as a Service）は、アプリケーションソフトウェアをクラウド上でサービスとして提供するモデルです。ユーザーはWebブラウザ等を通じてアプリケーションを利用できます。'
        },
        {
            id: 'it_003',
            subject: 'it',
            subjectName: '経営情報システム',
            year: 2022,
            difficulty: 'easy',
            question: 'データベースの正規化の目的として正しいのはどれか。',
            options: [
                'データの処理速度を向上させる',
                'データの重複を排除し、整合性を保つ',
                'データの暗号化を行う',
                'データの圧縮率を高める',
                'データのバックアップを自動化する'
            ],
            correctAnswer: 1,
            explanation: 'データベースの正規化は、データの重複を排除し、データの整合性を保つことを目的として行われます。これにより更新異常や削除異常を防ぐことができます。'
        },
        {
            id: 'it_004',
            subject: 'it',
            subjectName: '経営情報システム',
            year: 2022,
            difficulty: 'medium',
            question: 'システム開発手法のアジャイル開発の特徴として正しいのはどれか。',
            options: [
                '要件定義から実装まで順番に進め、後戻りしない',
                '短いイテレーション（スプリント）を繰り返し、継続的に改善する',
                '開発前に完全な仕様書を作成してから開発を開始する',
                '自動化ツールを使わず、手動テストのみで品質を担保する',
                '顧客との対話よりも契約交渉を優先する'
            ],
            correctAnswer: 1,
            explanation: 'アジャイル開発は短いイテレーション（スプリント）を繰り返しながら開発を進める手法です。変化への対応・顧客との継続的な協働・動くソフトウェアの継続的な提供を重視します。ウォーターフォール開発とは対照的です。'
        },
        {
            id: 'it_005',
            subject: 'it',
            subjectName: '経営情報システム',
            year: 2021,
            difficulty: 'hard',
            question: 'ITILv4におけるサービスデスクの役割として最も適切な記述はどれか。',
            options: [
                'ハードウェアの修理・交換のみを担当する',
                'ユーザーとITサービス組織の単一の接触点として機能する',
                'セキュリティ監査を専門に担当する',
                '新規システムの開発のみを担当する',
                'ベンダー管理と調達のみを担当する'
            ],
            correctAnswer: 1,
            explanation: 'ITILにおけるサービスデスクは「ユーザーとITサービス組織の単一の接触点（Single Point of Contact: SPOC）」として機能します。インシデント管理・サービスリクエスト・情報提供など幅広いサポートを担います。'
        }
    ],

    // 中小企業経営・政策
    policy: [
        {
            id: 'pol_001',
            subject: 'policy',
            subjectName: '中小企業経営・政策',
            year: 2023,
            difficulty: 'medium',
            question: '中小企業基本法における中小企業の定義として正しいのはどれか。（製造業の場合）',
            options: [
                '資本金3億円以下または従業員300人以下',
                '資本金1億円以下または従業員100人以下',
                '資本金5000万円以下または従業員50人以下',
                '資本金1000万円以下または従業員10人以下',
                '従業員のみで判定し、資本金は無関係'
            ],
            correctAnswer: 0,
            explanation: '中小企業基本法では、製造業において資本金3億円以下または従業員300人以下の企業を中小企業と定義しています。業種により基準は異なります。'
        },
        {
            id: 'pol_002',
            subject: 'policy',
            subjectName: '中小企業経営・政策',
            year: 2023,
            difficulty: 'hard',
            question: '事業承継税制の特例措置について正しい記述はどれか。',
            options: [
                '相続税・贈与税の100%が永続的に免除される',
                '相続税・贈与税の80%が猶予され、一定要件下で免除される',
                '法人税のみが対象となる',
                '上場企業は対象外である',
                '承継後の事業継続義務はない'
            ],
            correctAnswer: 1,
            explanation: '事業承継税制の特例措置では、非上場株式等の相続税・贈与税の80%が猶予され、一定の要件を満たせば免除されます。事業継続等の要件があります。'
        },
        {
            id: 'pol_003',
            subject: 'policy',
            subjectName: '中小企業経営・政策',
            year: 2022,
            difficulty: 'easy',
            question: '中小企業庁の統計による中小企業の企業数の割合はどの程度か。',
            options: [
                '約70%',
                '約85%',
                '約99%',
                '約95%',
                '約90%'
            ],
            correctAnswer: 2,
            explanation: '中小企業庁の統計によると、日本の全企業数に占める中小企業の割合は約99%を超えており、日本経済の大部分を中小企業が担っています。'
        },
        {
            id: 'pol_004',
            subject: 'policy',
            subjectName: '中小企業経営・政策',
            year: 2022,
            difficulty: 'medium',
            question: '中小企業投資育成株式会社の主な業務として正しいのはどれか。',
            options: [
                '中小企業への融資（貸付）のみを行う',
                '中小企業の株式・新株予約権等を引き受けて資本参加する',
                '中小企業の経営コンサルティングのみを行う',
                '中小企業の海外展開支援のみを行う',
                '中小企業向けの採用支援のみを行う'
            ],
            correctAnswer: 1,
            explanation: '中小企業投資育成株式会社は、中小企業の自己資本の充実を支援するため、株式・新株予約権等を引き受けて資本参加する投資会社です。東京・大阪・名古屋の3社があります。'
        },
        {
            id: 'pol_005',
            subject: 'policy',
            subjectName: '中小企業経営・政策',
            year: 2021,
            difficulty: 'hard',
            question: '中小企業診断士の法的位置付けとして正しい記述はどれか。',
            options: [
                '中小企業基本法に基づく国家資格',
                '中小企業支援法に基づく国家資格',
                '商工会議所法に基づく公的資格',
                '経済産業省令に基づく民間資格',
                '中小企業経営支援等推進法に基づく国家資格'
            ],
            correctAnswer: 1,
            explanation: '中小企業診断士は「中小企業支援法」第11条に基づく国家資格です。「中小企業の経営診断の業務に従事する者」として位置付けられており、経済産業大臣が登録を行います。'
        }
    ]
};

// 科目情報
const SUBJECTS_INFO = {
    economics: {
        name: '経済学・経済政策',
        color: '#ef4444',
        icon: 'fas fa-chart-line'
    },
    finance: {
        name: '財務・会計',
        color: '#f97316',
        icon: 'fas fa-calculator'
    },
    management: {
        name: '企業経営理論',
        color: '#eab308',
        icon: 'fas fa-users'
    },
    operations: {
        name: '運営管理',
        color: '#22c55e',
        icon: 'fas fa-cogs'
    },
    legal: {
        name: '経営法務',
        color: '#06b6d4',
        icon: 'fas fa-gavel'
    },
    it: {
        name: '経営情報システム',
        color: '#3b82f6',
        icon: 'fas fa-laptop'
    },
    policy: {
        name: '中小企業経営・政策',
        color: '#8b5cf6',
        icon: 'fas fa-building'
    }
};

// 難易度情報
const DIFFICULTY_INFO = {
    easy: {
        name: '基礎',
        color: '#22c55e',
        icon: 'fas fa-circle'
    },
    medium: {
        name: '標準',
        color: '#eab308',
        icon: 'fas fa-circle'
    },
    hard: {
        name: '応用',
        color: '#ef4444',
        icon: 'fas fa-circle'
    }
};

// データベース関数
const QuizDatabase = {
    // 全ての問題を取得
    getAllQuestions: function() {
        let allQuestions = [];
        Object.keys(QUIZ_DATA).forEach(subject => {
            allQuestions = allQuestions.concat(QUIZ_DATA[subject]);
        });
        return allQuestions;
    },

    // 科目別の問題を取得
    getQuestionsBySubject: function(subject) {
        return QUIZ_DATA[subject] || [];
    },

    // 複数科目の問題を取得
    getQuestionsBySubjects: function(subjects) {
        let questions = [];
        subjects.forEach(subject => {
            if (QUIZ_DATA[subject]) {
                questions = questions.concat(QUIZ_DATA[subject]);
            }
        });
        return questions;
    },

    // 問題IDで問題を取得
    getQuestionById: function(questionId) {
        const allQuestions = this.getAllQuestions();
        return allQuestions.find(q => q.id === questionId);
    },

    // 難易度別の問題を取得
    getQuestionsByDifficulty: function(difficulty, subjects = null) {
        let questions = subjects ? this.getQuestionsBySubjects(subjects) : this.getAllQuestions();
        return questions.filter(q => q.difficulty === difficulty);
    },

    // 年度別の問題を取得
    getQuestionsByYear: function(year, subjects = null) {
        let questions = subjects ? this.getQuestionsBySubjects(subjects) : this.getAllQuestions();
        return questions.filter(q => q.year === year);
    },

    // ランダムに問題を取得
    getRandomQuestions: function(count, subjects = null) {
        let questions = subjects ? this.getQuestionsBySubjects(subjects) : this.getAllQuestions();
        
        // Fisher-Yates アルゴリズムでシャッフル
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        return questions.slice(0, Math.min(count, questions.length));
    },

    // 統計情報を取得
    getStatistics: function() {
        const allQuestions = this.getAllQuestions();
        const stats = {
            total: allQuestions.length,
            bySubject: {},
            byDifficulty: { easy: 0, medium: 0, hard: 0 },
            byYear: {}
        };

        // 科目別統計
        Object.keys(QUIZ_DATA).forEach(subject => {
            stats.bySubject[subject] = QUIZ_DATA[subject].length;
        });

        // 難易度別・年度別統計
        allQuestions.forEach(q => {
            stats.byDifficulty[q.difficulty]++;
            stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
        });

        return stats;
    }
};

// 問題データの検証
console.log('過去問データベース初期化完了');
console.log('統計情報:', QuizDatabase.getStatistics());