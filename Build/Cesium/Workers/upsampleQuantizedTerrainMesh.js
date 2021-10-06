define(["./when-54c2dc71","./Check-6c0211bc","./Math-fc8cecf5","./Cartesian2-bddc1162","./Transforms-d07bb42c","./RuntimeError-2109023a","./WebGLConstants-76bb35d1","./ComponentDatatype-6d99a1ee","./AttributeCompression-9fc99391","./IndexDatatype-53503fee","./IntersectionTests-8abf6dba","./Plane-c8971487","./createTaskProcessorWorker","./EllipsoidTangentPlane-0a0e472c","./OrientedBoundingBox-2c275398","./TerrainEncoding-d6aef4ae"],function(g,e,oe,ae,pe,t,i,n,s,de,r,h,u,o,fe,le){"use strict";var ce={clipTriangleAtAxisAlignedThreshold:function(e,t,i,n,s,r){var h,u,o;g.defined(r)?r.length=0:r=[],o=t?(h=i<e,u=n<e,s<e):(h=e<i,u=e<n,e<s);var a,p,d,f,l,c,t=h+u+o;return 1===t?h?(a=(e-i)/(n-i),p=(e-i)/(s-i),r.push(1),r.push(2),1!==p&&(r.push(-1),r.push(0),r.push(2),r.push(p)),1!==a&&(r.push(-1),r.push(0),r.push(1),r.push(a))):u?(d=(e-n)/(s-n),f=(e-n)/(i-n),r.push(2),r.push(0),1!==f&&(r.push(-1),r.push(1),r.push(0),r.push(f)),1!==d&&(r.push(-1),r.push(1),r.push(2),r.push(d))):o&&(l=(e-s)/(i-s),c=(e-s)/(n-s),r.push(0),r.push(1),1!==c&&(r.push(-1),r.push(2),r.push(1),r.push(c)),1!==l&&(r.push(-1),r.push(2),r.push(0),r.push(l))):2===t?h||i===e?u||n===e?o||s===e||(p=(e-i)/(s-i),d=(e-n)/(s-n),r.push(2),r.push(-1),r.push(0),r.push(2),r.push(p),r.push(-1),r.push(1),r.push(2),r.push(d)):(c=(e-s)/(n-s),a=(e-i)/(n-i),r.push(1),r.push(-1),r.push(2),r.push(1),r.push(c),r.push(-1),r.push(0),r.push(1),r.push(a)):(f=(e-n)/(i-n),l=(e-s)/(i-s),r.push(0),r.push(-1),r.push(1),r.push(0),r.push(f),r.push(-1),r.push(2),r.push(0),r.push(l)):3!==t&&(r.push(0),r.push(1),r.push(2)),r},computeBarycentricCoordinates:function(e,t,i,n,s,r,h,u,o){var a=i-h,i=h-s,s=r-u,r=n-u,n=1/(s*a+i*r),u=t-u,h=e-h,i=(s*h+i*u)*n,u=(-r*h+a*u)*n,n=1-i-u;return g.defined(o)?(o.x=i,o.y=u,o.z=n,o):new ae.Cartesian3(i,u,n)},computeLineSegmentLineSegmentIntersection:function(e,t,i,n,s,r,h,u,o){var a=(h-s)*(t-r)-(u-r)*(e-s),p=(i-e)*(t-r)-(n-t)*(e-s),s=(u-r)*(i-e)-(h-s)*(n-t);if(0!=s){a=a/s,s=p/s;return 0<=a&&a<=1&&0<=s&&s<=1?(g.defined(o)||(o=new ae.Cartesian2),o.x=e+a*(i-e),o.y=t+a*(n-t),o):void 0}}},ge=32767,me=16383,xe=[],we=[],Ce=[],ve=new ae.Cartographic,ye=new ae.Cartesian3,Be=[],Ie=[],be=[],Ae=[],Te=[],ze=new ae.Cartesian3,Me=new pe.BoundingSphere,Ne=new fe.OrientedBoundingBox,Ve=new ae.Cartesian2,Ee=new ae.Cartesian3;function Re(){this.vertexBuffer=void 0,this.index=void 0,this.first=void 0,this.second=void 0,this.ratio=void 0}Re.prototype.clone=function(e){return g.defined(e)||(e=new Re),e.uBuffer=this.uBuffer,e.vBuffer=this.vBuffer,e.heightBuffer=this.heightBuffer,e.normalBuffer=this.normalBuffer,e.index=this.index,e.first=this.first,e.second=this.second,e.ratio=this.ratio,e},Re.prototype.initializeIndexed=function(e,t,i,n,s){this.uBuffer=e,this.vBuffer=t,this.heightBuffer=i,this.normalBuffer=n,this.index=s,this.first=void 0,this.second=void 0,this.ratio=void 0},Re.prototype.initializeFromClipResult=function(e,t,i){var n=t+1;return-1!==e[t]?i[e[t]].clone(this):(this.vertexBuffer=void 0,this.index=void 0,this.first=i[e[n]],++n,this.second=i[e[n]],++n,this.ratio=e[n],++n),n},Re.prototype.getKey=function(){return this.isIndexed()?this.index:JSON.stringify({first:this.first.getKey(),second:this.second.getKey(),ratio:this.ratio})},Re.prototype.isIndexed=function(){return g.defined(this.index)},Re.prototype.getH=function(){return g.defined(this.index)?this.heightBuffer[this.index]:oe.CesiumMath.lerp(this.first.getH(),this.second.getH(),this.ratio)},Re.prototype.getU=function(){return g.defined(this.index)?this.uBuffer[this.index]:oe.CesiumMath.lerp(this.first.getU(),this.second.getU(),this.ratio)},Re.prototype.getV=function(){return g.defined(this.index)?this.vBuffer[this.index]:oe.CesiumMath.lerp(this.first.getV(),this.second.getV(),this.ratio)};var a=new ae.Cartesian2,p=-1,d=[new ae.Cartesian3,new ae.Cartesian3],f=[new ae.Cartesian3,new ae.Cartesian3];function l(e,t){var i=d[++p],n=f[p],i=s.AttributeCompression.octDecode(e.first.getNormalX(),e.first.getNormalY(),i),n=s.AttributeCompression.octDecode(e.second.getNormalX(),e.second.getNormalY(),n);return ye=ae.Cartesian3.lerp(i,n,e.ratio,ye),ae.Cartesian3.normalize(ye,ye),s.AttributeCompression.octEncode(ye,t),--p,t}Re.prototype.getNormalX=function(){return g.defined(this.index)?this.normalBuffer[2*this.index]:(a=l(this,a)).x},Re.prototype.getNormalY=function(){return g.defined(this.index)?this.normalBuffer[2*this.index+1]:(a=l(this,a)).y};var m=[];function He(e,t,i,n,s,r,h,u,o){if(0!==h.length){for(var a=0,p=0;p<h.length;)p=m[a++].initializeFromClipResult(h,p,u);for(var d=0;d<a;++d){var f,l,c=m[d];c.isIndexed()?(c.newIndex=r[c.index],c.uBuffer=e,c.vBuffer=t,c.heightBuffer=i,o&&(c.normalBuffer=n)):(f=c.getKey(),g.defined(r[f])?c.newIndex=r[f]:(l=e.length,e.push(c.getU()),t.push(c.getV()),i.push(c.getH()),o&&(n.push(c.getNormalX()),n.push(c.getNormalY())),c.newIndex=l,r[f]=l))}3===a?(s.push(m[0].newIndex),s.push(m[1].newIndex),s.push(m[2].newIndex)):4===a&&(s.push(m[0].newIndex),s.push(m[1].newIndex),s.push(m[2].newIndex),s.push(m[0].newIndex),s.push(m[2].newIndex),s.push(m[3].newIndex))}}return m.push(new Re),m.push(new Re),m.push(new Re),m.push(new Re),u(function(e,t){var i=e.isEastChild,n=e.isNorthChild,s=i?me:0,r=i?ge:me,h=n?me:0,u=n?ge:me,o=Be,a=Ie,p=be,d=Te;o.length=0,a.length=0,p.length=0,d.length=0;var f=Ae;f.length=0;for(var l={},c=e.vertices,g=(g=e.indices).subarray(0,e.indexCountWithoutSkirts),m=le.TerrainEncoding.clone(e.encoding),x=m.hasVertexNormals,w=e.exaggeration,C=0,v=e.vertexCountWithoutSkirts,y=e.minimumHeight,B=e.maximumHeight,I=new Array(v),b=new Array(v),A=new Array(v),T=x?new Array(2*v):void 0,z=0,M=0;z<v;++z,M+=2){var N=m.decodeTextureCoordinates(c,z,Ve),V=m.decodeHeight(c,z)/w,E=oe.CesiumMath.clamp(N.x*ge|0,0,ge),R=oe.CesiumMath.clamp(N.y*ge|0,0,ge);A[z]=oe.CesiumMath.clamp((V-y)/(B-y)*ge|0,0,ge),E<20&&(E=0),R<20&&(R=0),ge-E<20&&(E=ge),ge-R<20&&(R=ge),I[z]=E,b[z]=R,x&&(N=m.getOctEncodedNormal(c,z,Ee),T[M]=N.x,T[M+1]=N.y),(i&&me<=E||!i&&E<=me)&&(n&&me<=R||!n&&R<=me)&&(l[z]=C,o.push(E),a.push(R),p.push(A[z]),x&&(d.push(T[M]),d.push(T[M+1])),++C)}var H=[];H.push(new Re),H.push(new Re),H.push(new Re);var O=[];for(O.push(new Re),O.push(new Re),O.push(new Re),z=0;z<g.length;z+=3){var S=g[z],U=g[z+1],F=g[z+2],P=I[S],k=I[U],D=I[F];H[0].initializeIndexed(I,b,A,T,S),H[1].initializeIndexed(I,b,A,T,U),H[2].initializeIndexed(I,b,A,T,F);k=ce.clipTriangleAtAxisAlignedThreshold(me,i,P,k,D,xe);k.length<=0||(D=O[0].initializeFromClipResult(k,0,H))>=k.length||(D=O[1].initializeFromClipResult(k,D,H))>=k.length||(D=O[2].initializeFromClipResult(k,D,H),He(o,a,p,d,f,l,ce.clipTriangleAtAxisAlignedThreshold(me,n,O[0].getV(),O[1].getV(),O[2].getV(),we),O,x),D<k.length&&(O[2].clone(O[1]),O[2].initializeFromClipResult(k,D,H),He(o,a,p,d,f,l,ce.clipTriangleAtAxisAlignedThreshold(me,n,O[0].getV(),O[1].getV(),O[2].getV(),we),O,x)))}var W=i?-ge:0,X=n?-ge:0,K=[],L=[],Y=[],_=[],G=Number.MAX_VALUE,J=-G,Z=Ce;Z.length=0;var j=ae.Ellipsoid.clone(e.ellipsoid),q=(ue=ae.Rectangle.clone(e.childRectangle)).north,Q=ue.south,$=ue.east,ee=ue.west;for($<ee&&($+=oe.CesiumMath.TWO_PI),z=0;z<o.length;++z)E=(E=Math.round(o[z]))<=s?(K.push(z),0):r<=E?(Y.push(z),ge):2*E+W,o[z]=E,R=(R=Math.round(a[z]))<=h?(L.push(z),0):u<=R?(_.push(z),ge):2*R+X,a[z]=R,(V=oe.CesiumMath.lerp(y,B,p[z]/ge))<G&&(G=V),J<V&&(J=V),p[z]=V,ve.longitude=oe.CesiumMath.lerp(ee,$,E/ge),ve.latitude=oe.CesiumMath.lerp(Q,q,R/ge),ve.height=V,j.cartographicToCartesian(ve,ye),Z.push(ye.x),Z.push(ye.y),Z.push(ye.z);var te=pe.BoundingSphere.fromVertices(Z,ae.Cartesian3.ZERO,3,Me),ie=fe.OrientedBoundingBox.fromRectangle(ue,G,J,j,Ne),e=new le.EllipsoidalOccluder(j).computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid(te.center,Z,3,te.center,G,ze),ne=J-G,se=new Uint16Array(o.length+a.length+p.length);for(z=0;z<o.length;++z)se[z]=o[z];var re=o.length;for(z=0;z<a.length;++z)se[re+z]=a[z];for(re+=a.length,z=0;z<p.length;++z)se[re+z]=ge*(p[z]-G)/ne;var he,ue=de.IndexDatatype.createTypedArray(o.length,f);return x?(he=new Uint8Array(d),t.push(se.buffer,ue.buffer,he.buffer),he=he.buffer):t.push(se.buffer,ue.buffer),{vertices:se.buffer,encodedNormals:he,indices:ue.buffer,minimumHeight:G,maximumHeight:J,westIndices:K,southIndices:L,eastIndices:Y,northIndices:_,boundingSphere:te,orientedBoundingBox:ie,horizonOcclusionPoint:e}})});
